import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Buyer routes
router.post('/', verifyToken, authorize('buyer'), createOrder);
router.get('/my-orders', verifyToken, authorize('buyer'), getMyOrders);

// Admin routes
router.get('/', verifyToken, authorize('admin'), getAllOrders);
router.put('/:id/status', verifyToken, authorize('admin'), updateOrderStatus);

export default router;
