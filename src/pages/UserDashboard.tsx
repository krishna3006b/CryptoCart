import React, { useState, useEffect } from "react";
import {
  Wallet,
  QrCode,
  History,
  Award,
  Menu,
  Search,
  Bell,
  User,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Clock,
  Loader2,
  X,
  DollarSign,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/assets/logo";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useToast } from "@/hooks/use-toast";

const UserDashboard: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [xlmBalance, setXlmBalance] = useState(0);
  const [xlmPrice, setXlmPrice] = useState(0);
  const [reputationPoints, setReputationPoints] = useState(0); // Initial RP is 0 for new users
  const [dailyLimit, setDailyLimit] = useState(500); // Initial daily limit 500 INR for 0 RP
  const [transactionsToday, setTransactionsToday] = useState(0);
  const { toast } = useToast();

  // Update daily limit based on reputation points
  useEffect(() => {
    if (reputationPoints >= 100) {
      setDailyLimit(2000); // 2000 INR limit for 100+ RP
    } else {
      setDailyLimit(500); // 500 INR limit for < 100 RP
    }
  }, [reputationPoints]);

  // Simulated API call to get XLM price
  useEffect(() => {
    const fetchXlmPrice = async () => {
      setTimeout(() => {
        setXlmPrice(18.75); // Example price in INR
      }, 1000);
    };

    fetchXlmPrice();
  }, []);

  // Handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
    setXlmBalance(250.75);

    toast({
      title: "Wallet Connected",
      description: "Your XLM wallet has been successfully connected!",
    });
  };

  // Simulated transaction completion (for demo purposes)
  const handleTransactionComplete = () => {
    setReputationPoints(prev => prev + 20); // Add 20 RP per completed transaction
    setTransactionsToday(prev => prev + 1);
  };

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
            <Wallet className="mr-3 h-5 w-5" />
            <span>Wallet</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <QrCode className="mr-3 h-5 w-5" />
            <span>Scan & Pay</span>
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
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-crypto-purple/20 rounded-full flex items-center justify-center">
                <span className="text-crypto-purple font-semibold">JS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-4 md:p-6">
          {!isWalletConnected ? (
            <WalletConnect userType="user" onWalletConnect={handleWalletConnect} />
          ) : (
            <div className="glass-card p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Wallet Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-white/70 mb-2">Today's Limit</p>
                      <div className="flex items-baseline">
                        <h3 className="text-xl font-semibold">₹{dailyLimit}</h3>
                        <span className="ml-2 text-sm text-white/70">INR</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">
                        {transactionsToday}/5 transactions today
                      </p>
                    </div>
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <Info className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-crypto-purple h-2 rounded-full"
                        style={{ width: `${(transactionsToday / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="w-full h-auto py-3 flex items-center justify-center"
                    onClick={handleTransactionComplete} // Demo purpose
                  >
                    <QrCode className="mr-3 h-5 w-5" />
                    <span>Scan & Pay</span>
                  </Button>
                  <Button variant="outline" className="w-full h-auto py-3 flex items-center justify-center">
                    <DollarSign className="mr-3 h-5 w-5" />
                    <span>View Transaction History</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isWalletConnected && (
            <div className="glass-card p-6 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                    <ArrowDownRight className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Received from Merchant</h4>
                    <p className="text-sm text-gray-400">Today, 2:45 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-500">+15.5 XLM</p>
                    <p className="text-sm text-gray-400">≈ ₹{(15.5 * xlmPrice).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="bg-red-500/20 p-2 rounded-lg mr-3">
                    <ArrowUpRight className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Payment to CryptoMart</h4>
                    <p className="text-sm text-gray-400">Yesterday, 11:20 AM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-500">-25.0 XLM</p>
                    <p className="text-sm text-gray-400">≈ ₹{(25.0 * xlmPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reputation Points Overview */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reputation Points Overview</h2>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Total Reputation Points</p>
                <p className="font-semibold">{reputationPoints} RP</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-crypto-purple h-2.5 rounded-full"
                  style={{ width: `${Math.min((reputationPoints / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {reputationPoints < 100
                  ? `${100 - reputationPoints} RP needed for ₹2000 daily limit`
                  : "Maximum daily limit of ₹2000 unlocked!"}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Earn 20 RP per completed transaction to increase your reputation and daily limit.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;