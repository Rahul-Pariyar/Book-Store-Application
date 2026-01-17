import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, authorize('admin'), getAllUsers);
router.get('/:id', verifyToken, authorize('admin'), getUserById);
router.put('/:id', verifyToken, authorize('admin'), updateUser);
router.delete('/:id', verifyToken, authorize('admin'), deleteUser);

export default router;
