import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import { setupSocketHandlers } from './sockets/socket.handlers.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/xlm-pay-connect', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup socket handlers
setupSocketHandlers(io);

// API routes
app.use('/api', authRoutes);
app.use('/api', orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
