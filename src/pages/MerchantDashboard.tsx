import React, { useState, useEffect } from "react";
import {
  Store,
  Package,
  History,
  Award,
  Menu,
  Search,
  Bell,
  User,
  ChevronRight,
  FileCheck,
  DollarSign,
  Check,
  Clock,
  ShieldCheck,
  X,
  Upload,
  QrCode,
  Wallet,
  Info,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/assets/logo";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const socket = io('http://localhost:5000', { transports: ['websocket'], autoConnect: false });

interface CustomJwtPayload {
  id: string;
  type: string;
  iat?: number;
  exp?: number;
}

const MerchantDashboard: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [xlmBalance, setXlmBalance] = useState(0);
  const [xlmPrice, setXlmPrice] = useState(0);
  const [reputationPoints, setReputationPoints] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [acceptedOrder, setAcceptedOrder] = useState<any>(null);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Connect socket on mount
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  // Log Socket.IO connection status
  useEffect(() => {
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
        setXlmPrice(18.75);
      }
    };
    fetchXlmPrice();
  }, []);

  // Handle mock wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
    setXlmBalance(1250.35);

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      socket.emit('merchantOnline', decoded.id);
      console.log(`Merchant ${decoded.id} emitted merchantOnline`);
    }

    toast({
      title: "Wallet Connected",
      description: "Your mock XLM wallet has been successfully connected!",
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


  // Toggle online status
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      if (!isOnline) {
        socket.emit('merchantOnline', decoded.id);
        console.log(`Merchant ${decoded.id} went online`);
      } else {
        socket.emit('disconnectMerchant', decoded.id); // Custom event to remove from onlineMerchants
        console.log(`Merchant ${decoded.id} went offline`);
      }
    }
    toast({
      title: isOnline ? "You're now offline" : "You're now online",
      description: isOnline
        ? "You won't receive new orders while offline"
        : "You're now visible to customers and can receive orders",
    });
  };

  // Real-time order and completion handling
  useEffect(() => {
    socket.on('newOrder', (order) => {
      console.log('Received newOrder event:', order);
      if (isOnline) {
        setPendingOrders((prev) => {
          const newOrders = [...prev, order];
          console.log('Updated pendingOrders:', newOrders);
          return newOrders;
        });
        toast({
          title: "New Order Received",
          description: `Order for ₹${order.inrAmount} (${order.xlmAmount.toFixed(2)} XLM)`,
        });
      } else {
        console.log('Order ignored: Merchant is offline');
      }
    });

    socket.on('orderVerified', (order) => {
      console.log('Received orderVerified event:', order);
      if (acceptedOrder && order.transactionId === acceptedOrder.transactionId) {
        setXlmBalance((prev) => prev + order.xlmAmount);
        console.log(`Mock credit: ${order.xlmAmount} XLM to ${walletAddress}`);
        setReputationPoints((prev) => prev + 20);
        setCompletedOrders((prev) => [...prev, { ...acceptedOrder, completedAt: new Date() }]);
        setAcceptedOrder(null);
        toast({
          title: "Order Completed",
          description: `Received ${order.xlmAmount.toFixed(2)} XLM for order #${order.transactionId}.`,
        });
      }
    });

    return () => {
      socket.off('newOrder');
      socket.off('orderVerified');
    };
  }, [isOnline, acceptedOrder]);

  // Accept an order
  const handleAcceptOrder = async (order: any) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/orders/${order.transactionId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAcceptedOrder(order);
      setPendingOrders((prev) => prev.filter((o) => o.transactionId !== order.transactionId));
      toast({
        title: "Order Accepted",
        description: `You’ve accepted order #${order.transactionId}. Upload INR payment proof.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to accept order.",
      });
    }
  };

  // Upload proof to Cloudinary
  const handleUploadProof = async () => {
    if (!acceptedOrder || !proofFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a proof file.",
      });
      return;
    }

    const formData = new FormData();
    formData.append('proof', proofFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/orders/${acceptedOrder.transactionId}/proof`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      setAcceptedOrder((prev) => ({ ...prev, proofUrl: response.data.proofUrl }));
      toast({
        title: "Proof Uploaded",
        description: "Payment proof uploaded to Cloudinary. Awaiting user verification.",
      });
      setProofFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to upload proof.",
      });
    }
  };

  // Calculate processing speed based on RP
  const getProcessingSpeed = () => {
    if (reputationPoints >= 100) return "Fast (Priority Processing)";
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
              <h1 className="text-xl font-semibold">Merchant Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={isOnline ? "outline" : "default"}
                size="sm"
                className={isOnline ? "border-green-500 text-green-500" : ""}
                onClick={toggleOnlineStatus}
              >
                {isOnline ? (
                  <>
                    <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </>
                ) : (
                  <>
                    <span className="mr-2 h-2 w-2 rounded-full bg-gray-500"></span>
                    Offline
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-crypto-purple/20 rounded-full flex items-center justify-center">
                <span className="text-crypto-purple font-semibold">CM</span>
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
            <WalletConnect userType="merchant" onWalletConnect={handleWalletConnect} />
          ) : (
            <div className="glass-card p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Store Overview</h2>
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
                      <p className="text-white/70 mb-2">Status</p>
                      <h3 className="text-xl font-semibold">
                        {isOnline ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span className="text-gray-400">Offline</span>
                        )}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-full ${isOnline ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                      {isOnline ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={isOnline ? "outline" : "default"}
                      className="w-full"
                      onClick={toggleOnlineStatus}
                    >
                      {isOnline ? "Go Offline" : "Go Online"}
                    </Button>
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
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button className="w-full h-auto py-3 flex items-center justify-center">
                    <Package className="mr-3 h-5 w-5" />
                    <span>View Orders</span>
                  </Button>
                  <Button variant="outline" className="w-full h-auto py-3 flex items-center justify-center">
                    <QrCode className="mr-3 h-5 w-5" />
                    <span>Download Store QR</span>
                  </Button>
                  <Button variant="outline" className="w-full h-auto py-3 flex items-center justify-center">
                    <Wallet className="mr-3 h-5 w-5" />
                    <span>Withdraw Funds</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pending Orders */}
          <div className="glass-card p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pending Orders</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {pendingOrders.length === 0 && (
                <p className="text-gray-400">No pending orders available.</p>
              )}
              {pendingOrders.map((order) => (
                <div key={order.transactionId} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Order #{order.transactionId}</h4>
                        <span className="ml-2 text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                          Awaiting Acceptance
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Received just now</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.xlmAmount.toFixed(2)} XLM</p>
                      <p className="text-sm text-gray-400">≈ ₹{order.inrAmount.toFixed(2)} INR</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-sm text-gray-400">Accept within 30s</span>
                    </div>
                    <Button onClick={() => handleAcceptOrder(order)} size="sm">
                      Accept Order
                    </Button>
                  </div>
                </div>
              ))}
              {acceptedOrder && (
                <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Order #{acceptedOrder.transactionId}</h4>
                        <span className="ml-2 text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full">
                          {acceptedOrder.proofUrl ? "Proof Uploaded" : "Accepted - Upload Proof"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {acceptedOrder.proofUrl ? (
                          <a href={acceptedOrder.proofUrl} target="_blank" className="text-crypto-purple">View Proof</a>
                        ) : "Awaiting INR Payment"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{acceptedOrder.xlmAmount.toFixed(2)} XLM</p>
                      <p className="text-sm text-gray-400">≈ ₹{acceptedOrder.inrAmount.toFixed(2)} INR</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    {!acceptedOrder.proofUrl ? (
                      <>
                        <Input
                          type="file"
                          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                          className="w-2/3"
                        />
                        <Button onClick={handleUploadProof} size="sm">
                          Upload Proof
                          <Upload className="ml-2 h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">Waiting for user verification...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Completed Orders */}
          <div className="glass-card p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Completed Orders</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
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
                          <p>{order.xlmAmount.toFixed(2)} XLM</p>
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
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">#38289</td>
                    <td className="py-3 px-4 text-gray-400">Today, 11:20 AM</td>
                    <td className="py-3 px-4">
                      <div>
                        <p>25.0 XLM</p>
                        <p className="text-sm text-gray-400">₹{(25.0 * xlmPrice).toFixed(2)} INR</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Completed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gray-400">Mock Proof</span>
                    </td>
                  </tr>
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
                  ? "Basic Processing - Earn 20 RP per order"
                  : reputationPoints < 100
                    ? "Standard Processing - 50 RP more for Priority"
                    : "Priority Processing Unlocked!"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Processing Speed</p>
                  <Clock className="h-4 w-4 text-crypto-neon" />
                </div>
                <p className="text-xl font-semibold">{getProcessingSpeed()}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Completed Orders</p>
                  <FileCheck className="h-4 w-4 text-crypto-neon" />
                </div>
                <p className="text-xl font-semibold">{Math.floor(reputationPoints / 20)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Acceptance Rate</p>
                  <Check className="h-4 w-4 text-crypto-neon" />
                </div>
                <p className="text-xl font-semibold">98%</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Higher reputation points enable faster order processing. Earn 20 RP per completed order.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;