
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Link, ExternalLink } from "lucide-react";

interface WalletConnectProps {
  userType: "user" | "merchant";
  onWalletConnect?: (address: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  userType,
  onWalletConnect,
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // This would need to be replaced with actual wallet integration
  const connectWallet = async () => {
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Wallet address required",
        description: "Please enter your XLM wallet address",
      });
      return;
    }

    setIsConnecting(true);

    // Simulate wallet connection - would use actual Trust Wallet integration
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
      });
      
      if (onWalletConnect) {
        onWalletConnect(walletAddress);
      }
    }, 1500);
  };

  return (
    <div className="glass-card p-6 rounded-2xl mb-6">
      <h2 className="text-xl font-semibold mb-4">Connect XLM Wallet</h2>
      
      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-gray-400">
            Connect your Trust Wallet to {userType === "user" ? "make payments" : "receive payments"} with XLM.
          </p>
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your XLM wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Link size={14} />
              <span>
                Don't have a wallet?{" "}
                <a 
                  href="https://trustwallet.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-crypto-purple hover:underline"
                >
                  Download Trust Wallet
                </a>
              </span>
            </div>
          </div>
          
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting} 
            className="w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Connected Wallet</p>
              <p className="font-medium">
                {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 6)}
              </p>
            </div>
            <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
              Connected
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                setIsConnected(false);
                setWalletAddress("");
              }}
            >
              Disconnect
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                window.open(`https://stellar.expert/explorer/public/account/${walletAddress}`, '_blank');
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
