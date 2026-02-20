import User from "../models/User.js";
import { getIO } from "../config/socketConfig.js";
import AppError from "../utils/AppError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export const getAllUsers = AsyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export const getUserById = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json(user);
});

export const updateUser = AsyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isActive },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Emit user update to admins only
  try {
    const io = getIO();
    io.to("admins").emit("user-updated", user);
  } catch (err) {
    console.log("Socket emit failed:", err.message);
  }

  res.json({ message: "User updated successfully", user });
});

export const deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Emit user deletion to admins only
  try {
    const io = getIO();
    io.to("admins").emit("user-deleted", { id: req.params.id });
  } catch (err) {
    console.log("Socket emit failed:", err.message);
  }

  res.json({ message: "User deleted successfully" });
});
