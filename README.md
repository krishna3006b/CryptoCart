<div align="center">

# 🚀 CryptoCart — XLM Pay Connect

**Bridge Crypto & Fiat for Seamless P2P Payments**

A full-stack P2P trading platform that enables users to spend **Stellar Lumens (XLM)** for everyday transactions while merchants receive **local fiat** through a secure escrow system.

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stellar](https://img.shields.io/badge/Stellar-XLM-7C3AED?logo=stellar&logoColor=white)](https://stellar.org)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#1-frontend-setup)
  - [Backend Setup](#2-backend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [WebSocket Events](#-websocket-events)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CryptoCart** (XLM Pay Connect) is a peer-to-peer crypto-to-fiat payment platform built on the **Stellar network**. It connects users who want to spend XLM with merchants who accept fiat, using a secure escrow mechanism to ensure trust on both sides.

Users can connect their **Freighter wallet**, create buy orders denominated in local fiat (INR), and have merchants fulfill those orders. Real-time communication via WebSockets keeps both parties updated throughout the transaction lifecycle.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Escrow** | XLM tokens are held in escrow until fiat payment is verified |
| ⚡ **Real-time Rates** | Live XLM-to-fiat conversion rates via CoinGecko API |
| 📱 **QR Code Payments** | Scan merchant QR codes to initiate payments instantly |
| 👛 **Freighter Wallet** | Native Stellar wallet integration via Stellar Wallets Kit |
| 🔔 **Real-time Notifications** | Socket.io powered live order updates for users & merchants |
| 📸 **Payment Proof Upload** | Merchants upload fiat payment proof via Cloudinary |
| 🏆 **Reputation Points (RP)** | Earn RP for transactions and referrals to unlock higher limits |
| 📊 **Transaction History** | Full order history with status tracking |
| 👤 **Dual Dashboards** | Separate, tailored dashboards for users and merchants |
| 🌙 **Modern Dark UI** | Beautiful glassmorphism-styled dark theme |

---

## 🔄 How It Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. User     │    │  2. Enter   │    │  3. XLM     │
│  Scans QR    │ →  │  Amount &   │ →  │  Sent to    │
│  Code        │    │  Pay        │    │  Escrow     │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
                                            ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  6. XLM     │    │  5. User    │    │  4. Merchant│
│  Released   │ ←  │  Verifies   │ ←  │  Sends Fiat │
│  to Merchant│    │  Payment    │    │  + Proof    │
└─────────────┘    └─────────────┘    └─────────────┘
```

1. **User scans** the merchant's QR code to initiate the payment
2. **User enters** the fiat amount, views XLM conversion, and confirms
3. **XLM tokens** are transferred to a secure escrow wallet
4. **Merchant sends** fiat payment and uploads proof (screenshot/receipt)
5. **User verifies** the fiat payment receipt
6. **XLM is released** from escrow to the merchant — both parties earn RP

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Radix-based component library |
| **React Router v6** | Client-side routing |
| **TanStack React Query** | Server state management |
| **Socket.io Client** | Real-time communication |
| **Stellar Wallets Kit** | Freighter wallet integration |
| **qrcode.react** | QR code generation |
| **Recharts** | Charts & data visualization |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Socket.io** | Real-time WebSocket server |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Image upload (payment proof) |
| **Multer** | File upload middleware |

---

## 📁 Project Structure

```
CryptoCart/
├── public/                    # Static assets
├── server/                    # Backend (Express API)
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   └── multer.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── order.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── order.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── order.routes.js
│   ├── sockets/
│   │   └── socket.handlers.js
│   ├── server.js              # Entry point
│   └── package.json
├── src/                       # Frontend (React + TypeScript)
│   ├── assets/                # SVGs, logos
│   ├── components/
│   │   ├── landing/           # Landing page sections
│   │   ├── layout/            # Header, Footer
│   │   ├── signup/            # Signup components
│   │   ├── ui/                # shadcn/ui components
│   │   └── wallet/            # Stellar wallet integration
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Login.tsx          # Login page
│   │   ├── Signup.tsx         # Registration page
│   │   ├── UserDashboard.tsx  # User dashboard
│   │   ├── MerchantDashboard.tsx # Merchant dashboard
│   │   └── NotFound.tsx       # 404 page
│   ├── App.tsx                # App routes
│   └── main.tsx               # Entry point
├── package.json
├── tailwind.config.ts
├── vite.config.ts
├── vercel.json                # Vercel deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **bun** (lockfile included for bun)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Freighter Wallet** browser extension ([Install](https://freighter.app))
- **Cloudinary** account (for payment proof uploads)

### 1. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/krishna3006b/CryptoCart.git
cd CryptoCart

# Install dependencies
npm install
# or
bun install

# Create environment file
cp .env.example .env
# Edit .env and set VITE_BACKEND to your backend URL

# Start development server
npm run dev
```

The frontend will be available at **http://localhost:8080**.

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file and configure variables (see below)

# Start development server
npm run dev
# or for production
npm start
```

The backend API will run on **http://localhost:5000**.

---

## 🔑 Environment Variables

### Frontend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND` | Backend API base URL | `http://localhost:5000` |

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/cryptocart` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/register` | Register a new user or merchant | ❌ |
| `POST` | `/api/login` | Login and receive JWT token | ❌ |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/orders` | Create a new order | 🔒 User |
| `POST` | `/api/orders/:id/accept` | Accept a pending order | 🔒 Merchant |
| `POST` | `/api/orders/:id/proof` | Upload fiat payment proof | 🔒 Merchant |
| `POST` | `/api/orders/:id/verify` | Verify payment & complete order | 🔒 User |
| `GET` | `/api/orders/pending` | Get all pending orders | 🔒 Merchant |

---

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `merchantOnline` | `merchantId` | Merchant connects and goes online |
| `userOnline` | `userId` | User connects and goes online |
| `disconnectMerchant` | `merchantId` | Merchant disconnects |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `newOrder` | Order object | New order created by a user |
| `orderAccepted` | Order object | Order accepted by a merchant |
| `proofUploaded` | Order object | Payment proof uploaded by merchant |
| `orderVerified` | Order object | Order verified and completed |

---

## 🌐 Deployment

### Frontend (Vercel)

The project includes a `vercel.json` for seamless deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend

Deploy the `server/` directory to any Node.js hosting platform:
- **Railway**
- **Render**
- **Fly.io**
- **Heroku**

Make sure to set all environment variables on your hosting platform.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ on the Stellar Network**

⭐ Star this repo if you find it useful!

</div>