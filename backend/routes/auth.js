import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { signupValidator,loginValidator } from '../middleware/validator.js';

const router = express.Router();

router.post('/signup',signupValidator, signup);
router.post('/login',loginValidator, login);
router.get('/profile', verifyToken, getProfile);

export default router;
