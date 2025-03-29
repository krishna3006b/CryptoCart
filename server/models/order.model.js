
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inrAmount: { type: Number, required: true },
  xlmAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  proofUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
