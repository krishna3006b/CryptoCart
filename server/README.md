
# XLM Pay Connect - Backend

This is the backend server for XLM Pay Connect, a P2P trading platform for Stellar (XLM) cryptocurrency.

## Features

- User authentication (JWT)
- Real-time order notifications with Socket.io
- Order management system
- Image upload for payment proof (Cloudinary)
- MongoDB database

## Setup

1. Install dependencies:
```
npm install
```

2. Start MongoDB:
```
mongod
```

3. Start the server:
```
npm run dev
```

The server will run on http://localhost:5000.

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login and receive JWT token

### Orders
- POST /api/orders - Create a new order (User only)
- POST /api/orders/:id/accept - Accept an order (Merchant only)
- POST /api/orders/:id/proof - Upload payment proof (Merchant only)
- POST /api/orders/:id/verify - Verify payment and complete order (User only)
- GET /api/orders/pending - Get all pending orders (Merchant only)

## Socket Events

### Client to Server
- merchantOnline - Merchant connects
- userOnline - User connects
- disconnectMerchant - Merchant disconnects

### Server to Client
- newOrder - New order created
- orderAccepted - Order has been accepted by merchant
- proofUploaded - Payment proof has been uploaded
- orderVerified - Order has been verified and completed

## Environment Variables (for production)
- PORT - Server port
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret for JWT tokens
- CLOUDINARY_CLOUD_NAME - Cloudinary cloud name
- CLOUDINARY_API_KEY - Cloudinary API key
- CLOUDINARY_API_SECRET - Cloudinary API secret
