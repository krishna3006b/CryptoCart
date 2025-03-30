import React, { useState, useEffect } from "react";
import {
  Store,
  Package,
  History,
  Award,
  Menu,
  Bell,
  User,
  FileCheck,
  Check,
  Clock,
  ShieldCheck,
  X,
  QrCode,
  Wallet,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/assets/logo";
// import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { WalletConnect } from '@/components/wallet/WalletConnect';

// Define the custom JWT payload type
interface CustomJwtPayload {
  id: string;
  type: string;
  iat?: number;
  exp?: number;
}

// Initialize socket outside the component
const socket = io('http://localhost:5000', { transports: ['websocket'], autoConnect: false });

const UserDashboard: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [xlmBalance, setXlmBalance] = useState(0);
  const [xlmPrice, setXlmPrice] = useState(0);
  const [reputationPoints, setReputationPoints] = useState(0);
  const [inrAmount, setInrAmount] = useState("");
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Connect socket on mount
  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });
    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  // Fetch XLM price from CoinGecko
  useEffect(() => {
    const fetchXlmPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=inr'
        );
        setXlmPrice(response.data.stellar.inr);
      } catch (error) {
        console.error('Error fetching XLM price:', error);
        setXlmPrice(18.75); // Fallback price
      }
    };
    fetchXlmPrice();
  }, []);

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
    try {
      const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`);
      const accountData = await response.json();
      const xlmBalance = accountData.balances.find(b => b.asset_type === 'native');
      if (xlmBalance) {
        setXlmBalance(parseFloat(xlmBalance.balance));
      }
    } catch (error) {
      console.error("Failed to fetch account balance:", error);
      setXlmBalance(0);
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        console.log('Decoded JWT:', decoded);
        socket.emit('userOnline', decoded.id);
        console.log(`User ${decoded.id} emitted userOnline`);
      } catch (error) {
        console.error('JWT decode error:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid token. Please log in again.",
        });
      }
    } else {
      console.log('No token found in localStorage');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to connect your wallet.",
      });
    }

    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected!",
    });
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    socket.disconnect();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  // Real-time proof upload handling
  useEffect(() => {
    socket.on('proofUploaded', (order) => {
      console.log('Received proofUploaded event:', order);
      if (currentOrder && order.transactionId === currentOrder.transactionId) {
        setCurrentOrder((prev) => ({ ...prev, proofUrl: order.proofUrl }));
        toast({
          title: "Proof Uploaded",
          description: `Merchant uploaded proof for order #${order.transactionId}. Please verify.`,
        });
      } else {
        console.log('Proof event ignored: No matching currentOrder');
      }
    });

    return () => {
      socket.off('proofUploaded');
    };
  }, [currentOrder]);

  // Create a new order
  const handleCreateOrder = async () => {
    if (!inrAmount || isNaN(Number(inrAmount)) || Number(inrAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid INR amount.",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        { inrAmount: Number(inrAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentOrder({ transactionId: response.data.transactionId, inrAmount: Number(inrAmount) });
      setInrAmount("");
      toast({
        title: "Order Created",
        description: `Order #${response.data.transactionId} created. Waiting for merchant acceptance.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to create order.",
      });
    }
  };

  // Verify merchant proof
  const handleVerifyProof = async () => {
    if (!currentOrder || !currentOrder.proofUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No proof available to verify.",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/orders/${currentOrder.transactionId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const xlmAmount = currentOrder.inrAmount / xlmPrice;
      setXlmBalance((prev) => prev - xlmAmount);
      setReputationPoints((prev) => prev + 20);
      setCompletedOrders((prev) => [...prev, { ...currentOrder, completedAt: new Date() }]);
      setCurrentOrder(null);
      toast({
        title: "Order Verified",
        description: `Order #${currentOrder.transactionId} completed. Sent ${xlmAmount.toFixed(2)} XLM.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to verify order.",
      });
    }
  };

  // Calculate processing speed based on RP
  const getProcessingSpeed = () => {
    if (reputationPoints >= 100) return "Fast";
    if (reputationPoints >= 50) return "Standard";
    return "Basic";
  };

  // Rest of the component (UI) remains unchanged...
  return (
    <div className="min-h-screen bg-crypto-dark flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className={`fixed md:static inset-0 z-40 md:z-auto bg-crypto-dark md:block glass-card md:w-64 md:h-screen p-4 md:p-6 transition-all duration-300 ${showMobileMenu ? "block" : "hidden"}`}>
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center p-3 rounded-lg bg-crypto-purple/20 text-crypto-purple">
            <Store className="mr-3 h-5 w-5" />
            <span>Overview</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <Package className="mr-3 h-5 w-5" />
            <span>Orders</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <History className="mr-3 h-5 w-5" />
            <span>Transactions</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <Award className="mr-3 h-5 w-5" />
            <span>Reputation</span>
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-card p-4 rounded-xl mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-800 rounded-full p-2">
                <Award className="h-5 w-5 text-crypto-neon" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Reputation Points</p>
                <p className="text-lg font-semibold text-white">{reputationPoints} RP</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:mx-20">
        {/* Header */}
        <header className="border-b border-white/10 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">User Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-crypto-purple/20 rounded-full flex items-center justify-center">
                <span className="text-crypto-purple font-semibold">CU</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-4 md:p-6">
          {!isWalletConnected ? (
            <WalletConnect userType="user" onWalletConnect={handleWalletConnect} />
          ) : (
            <div className="glass-card p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold mb-4">User Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-crypto-purple to-crypto-purple-dark rounded-xl p-5">
                  <p className="text-white/70 mb-2">XLM Balance</p>
                  <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold text-white">{xlmBalance.toFixed(2)}</h3>
                    <span className="ml-2 text-white/70">XLM</span>
                  </div>
                  <div className="mt-4 text-white/70">
                    <p>≈ ₹{(xlmBalance * xlmPrice).toFixed(2)} INR</p>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 mb-2">Processing Speed</p>
                      <h3 className="text-xl font-semibold">{getProcessingSpeed()}</h3>
                    </div>
                    <Clock className="h-10 w-10 text-crypto-purple" />
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 mb-2">Reputation Points</p>
                      <h3 className="text-xl font-semibold">{reputationPoints} RP</h3>
                    </div>
                    <Award className="h-10 w-10 text-crypto-purple" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Create New Order</h3>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    value={inrAmount}
                    onChange={(e) => setInrAmount(e.target.value)}
                    placeholder="Enter INR Amount"
                    className="w-1/2"
                  />
                  <Button onClick={handleCreateOrder}>
                    Create Order
                  </Button>
                </div>
                {currentOrder && !currentOrder.proofUrl && (
                  <div className="mt-4">
                    <p className="text-gray-400">Order #{currentOrder.transactionId} - Awaiting Merchant</p>
                    <QRCode value={`Order:${currentOrder.transactionId}:${currentOrder.inrAmount}`} size={128} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current Order */}
          {currentOrder && (
            <div className="glass-card p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Current Order</h2>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">Order #{currentOrder.transactionId}</h4>
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full">
                        {currentOrder.proofUrl ? "Proof Uploaded" : "Pending Merchant"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {currentOrder.proofUrl ? (
                        <a href={currentOrder.proofUrl} target="_blank" className="text-crypto-purple">View Proof</a>
                      ) : "Awaiting merchant acceptance and proof"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{(currentOrder.inrAmount / xlmPrice).toFixed(2)} XLM</p>
                    <p className="text-sm text-gray-400">₹{currentOrder.inrAmount.toFixed(2)} INR</p>
                  </div>
                </div>
                {currentOrder.proofUrl && (
                  <div className="border-t border-white/10 pt-3 flex justify-end">
                    <Button onClick={handleVerifyProof} size="sm">
                      Verify Proof
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Orders */}
          <div className="glass-card p-6 rounded-2xl mb-6">
            <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order) => (
                    <tr key={order.transactionId} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">#{order.transactionId}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(order.completedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{(order.inrAmount / xlmPrice).toFixed(2)} XLM</p>
                          <p className="text-sm text-gray-400">₹{order.inrAmount.toFixed(2)} INR</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" /> Completed
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a href={order.proofUrl} target="_blank" className="text-crypto-purple">
                          View Proof
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reputation Points Overview */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reputation & Performance</h2>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Reputation Points</p>
                <p className="font-semibold">{reputationPoints} RP</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-crypto-purple h-2.5 rounded-full"
                  style={{ width: `${Math.min((reputationPoints / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {reputationPoints < 50
                  ? "Basic - Earn 20 RP per order"
                  : reputationPoints < 100
                    ? "Standard - 50 RP more for Fast"
                    : "Fast Processing Unlocked!"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;