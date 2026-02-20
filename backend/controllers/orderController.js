import Order from "../models/Order.js";
import Book from "../models/Book.js";
import axios from "axios";
import { getIO } from "../config/socketConfig.js";
import AppError from "../utils/AppError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export const createOrder = AsyncHandler(async (req, res) => {
  const { items, deliveryAddress, paymentMethod } = req.body;

  if (!items || items.length === 0 || !deliveryAddress) {
    throw new AppError("Items and delivery address are required", 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const book = await Book.findById(item.book);
    if (!book) {
      throw new AppError(`Book ${item.book} not found`, 404);
    }

    if (book.quantity < item.quantity) {
      throw new AppError(`Insufficient stock for ${book.title}`, 400);
    }

    totalAmount += book.price * item.quantity;
    orderItems.push({
      book: book._id,
      quantity: item.quantity,
      price: book.price,
    });
  }

  if (paymentMethod == "COD") {
    // Update book quantities and emit book updates
    for (const item of orderItems) {
      const updatedBook = await Book.findByIdAndUpdate(
        item.book,
        { $inc: { quantity: -item.quantity } },
        { new: true },
      );

      // Emit book stock update to all users
      try {
        const io = getIO();
        io.emit("book-updated", updatedBook);
      } catch (err) {
        console.log("Socket emit failed:", err.message);
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      orderStatus: "confirmed",
    });

    await order.populate("items.book");
    await order.populate("user", "name email");

    // Emit order created event to admins and the buyer
    try {
      const io = getIO();
      io.to("admins").emit("order-created", order); // Notify all admins
      io.to(req.user.id).emit("my-order-created", order); // Notify the buyer
    } catch (err) {
      console.log("Socket emit failed:", err.message);
    }

    res.status(201).json({ message: "Order created successfully", order });
  } else if (paymentMethod == "KHALTI") {
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
    });

    const url = process.env.KHALTI_URL;
    const purchase_order_id = order._id;
    const purchase_order_name = `Book Order #${order._id.toString().slice(-6)}`;

    const payload = {
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      website_url: `${process.env.FRONTEND_URL}`,
      amount: totalAmount * 100,
      purchase_order_id,
      purchase_order_name,
    };

    const header = {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    try {
      const khaltiResponse = await axios.post(url, payload, {
        headers: header,
      });
      // handle khaltiResponse if needed (redirect user to payment page)
      order.pidx = khaltiResponse.data.pidx;
      await order.save();
      return res
        .status(201)
        .json({
          message: "Khalti payment initiated",
          payment_url: khaltiResponse.data.payment_url,
        });
    } catch (err) {
      console.error("Khalti payment initiation failed:", err);
    }
  }
});

export const getMyOrders = AsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.book");
  res.json(orders);
});

export const getAllOrders = AsyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.book");
  res.json(orders);
});

export const updateOrderStatus = AsyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  if (!orderStatus) {
    throw new AppError("Order status is required", 400);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus },
    { new: true },
  ).populate("items.book");

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Emit order update to admins and specific buyer
  try {
    const io = getIO();
    io.to("admins").emit("order-updated", order); // Notify all admins
    io.to(order.user._id.toString()).emit("my-order-updated", order); // Notify the buyer
  } catch (err) {
    console.log("Socket emit failed:", err.message);
  }

  res.json({ message: "Order status updated successfully", order });
});

export const verifyKhaltiPayment = AsyncHandler(async (req, res) => {
  const { pidx } = req.body;
  console.log(pidx);
  const verifyUrl = process.env.KHALTI_VERIFY_URL;
  const header = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
  };
  const order = await Order.findOne({ pidx }).populate("items.book");
  if (!order) throw new AppError("Order not found", 404);

  const khaltiVerify = await axios.post(
    verifyUrl,
    { pidx },
    { headers: header },
  );

  if (khaltiVerify.data.status === "Completed") {
    // Update book quantities and emit updates
    for (const item of order.items) {
      const updatedBook = await Book.findByIdAndUpdate(
        item.book._id,
        { $inc: { quantity: -item.quantity } },
        { new: true },
      );

      // Emit book stock update
      try {
        const io = getIO();
        io.emit("book-updated", updatedBook);
      } catch (err) {
        console.log("Socket emit failed:", err.message);
      }
    }

    order.orderStatus = "confirmed";
    order.paymentStatus = "paid";
    await order.save();

    // Emit order created event to admins and buyer
    try {
      const io = getIO();
      io.to("admins").emit("order-created", order);
      io.to(order.user._id.toString()).emit("my-order-created", order);
    } catch (err) {
      console.log("Socket emit failed:", err.message);
    }

    return res.json({ message: "Payment verified and order confirmed", order });
  } else {
    order.paymentStatus = "failed";
    await order.save();

    return res.status(400).json({ message: "Payment failed", order });
  }
});
