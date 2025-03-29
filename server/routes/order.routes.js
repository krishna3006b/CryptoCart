
import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticateToken, isUser, isMerchant } from '../middleware/auth.middleware.js';
import upload from '../config/multer.config.js';

const router = express.Router();

// Order routes
router.post('/orders', authenticateToken, isUser, orderController.createOrder);
router.post('/orders/:id/accept', authenticateToken, isMerchant, orderController.acceptOrder);
router.post('/orders/:id/proof', authenticateToken, isMerchant, upload.single('proof'), orderController.uploadProof);
router.post('/orders/:id/verify', authenticateToken, isUser, orderController.verifyOrder);
router.get('/orders/pending', authenticateToken, isMerchant, orderController.getPendingOrders);

export default router;
