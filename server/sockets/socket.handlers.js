
import { onlineMerchants } from '../controllers/order.controller.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('merchantOnline', (merchantId) => {
      onlineMerchants.add(merchantId);
      socket.join(merchantId);
      console.log(`Merchant ${merchantId} is online. Total online: ${onlineMerchants.size}`);
    });

    socket.on('userOnline', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} is online`);
    });

    socket.on('disconnectMerchant', (merchantId) => {
      onlineMerchants.delete(merchantId);
      socket.leave(merchantId);
      console.log(`Merchant ${merchantId} disconnected. Total online: ${onlineMerchants.size}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
