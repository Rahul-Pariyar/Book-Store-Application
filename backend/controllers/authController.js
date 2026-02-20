import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import AsyncHandler from '../utils/AsyncHandler.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const signup = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

   // Validation
   if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required",400);
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists",400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: 'buyer',
  });

  res.status(201).json({
    message: 'User created successfully',
    // token,
  });
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required",400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials",401);
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials",401); 
  }

  if (!user.isActive) {
    throw new AppError("User account is disabled",403);
  }

  const token = generateToken(user);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getProfile = AsyncHandler(async (req, res) => {
    //.select('-password') basically allows us to get data except password field
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new AppError("User not found",404);
  }
  res.json(user);
});
