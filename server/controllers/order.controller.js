
import Order from '../models/order.model.js';
import axios from 'axios';
import cloudinary from '../config/cloudinary.config.js';
import { io } from '../server.js';

// Track online merchants
export const onlineMerchants = new Set();

export const createOrder = async (req, res) => {
  try {
    const { inrAmount } = req.body;
    if (!inrAmount || isNaN(inrAmount) || inrAmount <= 0) {
      return res.status(400).json({ message: 'Invalid INR amount' });
    }
    
    const userId = req.user.id;
    
    // Get current XLM price in INR
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=inr');
    const xlmPrice = response.data.stellar.inr;
    const xlmAmount = inrAmount / xlmPrice;

    const order = new Order({ userId, inrAmount, xlmAmount });
    await order.save();

    // Broadcast new order to all online merchants
    console.log(`Order ${order._id} created by user ${userId}. Broadcasting to ${onlineMerchants.size} merchants:`, Array.from(onlineMerchants));
    onlineMerchants.forEach((merchantId) => {
      io.to(merchantId).emit('newOrder', {
        transactionId: order._id,
        inrAmount,
        xlmAmount,
      });
    });

    res.json({ transactionId: order._id });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const merchantId = req.user.id;
    
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'pending') {
      return res.status(400).json({ message: 'Order not found or already processed' });
    }
    
    order.merchantId = merchantId;
    order.status = 'accepted';
    await order.save();
    
    io.to(order.userId.toString()).emit('orderAccepted', {
      transactionId: order._id,
      merchantId
    });
    
    res.json({ message: 'Order accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept order', error: error.message });
  }
};

export const uploadProof = async (req, res) => {
  try {
    const orderId = req.params.id;
    const merchantId = req.user.id;
    
    const order = await Order.findById(orderId);
    if (!order || order.merchantId.toString() !== merchantId || order.status !== 'accepted') {
      return res.status(400).json({ message: 'Order not found or not accepted by you' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No proof file provided' });
    }

    console.log('Uploading proof to Cloudinary for order:', orderId);
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }).end(req.file.buffer);
    });

    order.proofUrl = result.secure_url;
    await order.save();
    
    console.log('Proof uploaded successfully:', result.secure_url);
    console.log('Emitting proofUploaded to user:', order.userId.toString());

    io.to(order.userId.toString()).emit('proofUploaded', {
      transactionId: order._id,
      proofUrl: order.proofUrl,
    });

    res.json({ proofUrl: order.proofUrl });
  } catch (error) {
    console.error('Proof upload error:', error);
    res.status(500).json({ message: 'Failed to upload proof', error: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== userId || order.status !== 'accepted' || !order.proofUrl) {
      return res.status(400).json({ message: 'Order not found or not ready for verification' });
    }
    
    order.status = 'completed';
    await order.save();

    io.to(order.merchantId.toString()).emit('orderVerified', {
      transactionId: order._id,
      xlmAmount: order.xlmAmount,
    });

    res.json({ message: 'Order verified' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify order', error: error.message });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' }).select('userId inrAmount xlmAmount _id');
    
    res.json(orders.map(order => ({
      transactionId: order._id,
      inrAmount: order.inrAmount,
      xlmAmount: order.xlmAmount,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending orders', error: error.message });
  }
};
