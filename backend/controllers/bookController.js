import Book from '../models/Book.js';
import cloudinary from "../config/cloudinaryConfig.js";
import { getIO } from '../config/socketConfig.js';
import AppError from '../utils/AppError.js';
import AsyncHandler from '../utils/AsyncHandler.js';

export const getBooks = AsyncHandler(async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

export const getBookById = AsyncHandler(async (req, res,next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new AppError("Book not found",404);
  }
  res.json(book);
});

export const createBook = AsyncHandler(async (req, res) => {
  const { title, author, description, price, quantity, category, isbn, image } = req.body;
  const file=req.file;

  if (!title || !author || !description || !price || !category) {
    throw new AppError("Required fields are missing",400);
  }

  if(!file){
    throw new AppError("Image is required",400);
  }

  const uploadImage=await new Promise((resolve,reject)=>{
    const stream=cloudinary.uploader.upload_stream(
      {
        folder: "properties",
        transformation: [
          { width: 800, height: 600, crop: "fill" },
          { fetch_format: "auto" }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    )
    stream.end(file.buffer);
  })

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    category,
    isbn,
    image:{
      url:uploadImage.secure_url,
      publicId:uploadImage.public_id
    }
  });

    // Emit socket event to all buyers and admins
  try {
    const io = getIO();
    io.emit('book-created', book); // Emit to everyone (admins and buyers)
  } catch (err) {
    console.log('Socket emit failed:', err.message);
  }

  res.status(201).json({ message: 'Book created successfully', book });
});

export const updateBook = AsyncHandler(async (req, res) => {
  // const { title, author, description, price, quantity, category, isbn, imageUrl } = req.body;
  const data = req.body;

  const book = await Book.findByIdAndUpdate(
    req.params.id,
   data,
    { new: true, runValidators: true }
  );

  if (!book) {
    throw new AppError("Book not found",404);
  }

  // Emit socket event to all buyers and admins
  try {
    const io = getIO();
    io.emit('book-updated', book);
  } catch (err) {
    console.log('Socket emit failed:', err.message);
  }

  res.json({ message: 'Book updated successfully', book });
});

export const deleteBook = AsyncHandler(async (req, res) => {
  const isBookOrdered = await Order.exists({ "items.book": req.params.id });

  if (isBookOrdered) {
    throw new AppError("This book is already ordered and cannot be deleted",400);
  }

  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    throw new AppError("Book not found",404);
  }

    // Emit socket event to all buyers and admins
  try {
    const io = getIO();
    io.emit('book-deleted', { id: req.params.id });
  } catch (err) {
    console.log('Socket emit failed:', err.message);
  }

  res.json({ message: 'Book deleted successfully' });
});
