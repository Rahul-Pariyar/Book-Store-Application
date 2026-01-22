import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin routes
router.post('/', verifyToken, authorize('admin'), upload.single("image"), createBook);
router.put('/:id', verifyToken, authorize('admin'), updateBook);
router.delete('/:id', verifyToken, authorize('admin'), deleteBook);

export default router;
