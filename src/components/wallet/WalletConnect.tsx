import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ExternalLink } from "lucide-react";
import { 
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  FREIGHTER_ID
} from '@creit.tech/stellar-wallets-kit';

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
  const [stellarKit, setStellarKit] = useState<StellarWalletsKit | null>(null);
  const { toast } = useToast();

  // Initialize the Stellar Wallets Kit
  useEffect(() => {
    try {
      const kit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET, // Use TESTNET for development
        selectedWalletId: FREIGHTER_ID,
        modules: [
          new FreighterModule(),
        ]
      });
      setStellarKit(kit);
    } catch (error) {
      console.error("Error initializing Stellar Wallets Kit:", error);
      toast({
        variant: "destructive",
        title: "Wallet Error",
        description: "Failed to initialize wallet connection. Please make sure Freighter is installed.",
      });
    }
  }, [toast]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (stellarKit) {
        try {
          const { address } = await stellarKit.getAddress();
          if (address) {
            setWalletAddress(address);
            setIsConnected(true);
          }
        } catch (error) {
          console.log("No wallet connected yet");
        }
      }
    };

    checkWalletConnection();
  }, [stellarKit]);

  const connectWallet = async () => {
    if (!stellarKit) {
      toast({
        variant: "destructive",
        title: "Wallet Error",
        description: "Wallet connection is not initialized. Please make sure Freighter is installed.",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const { address } = await stellarKit.getAddress();
      setWalletAddress(address);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
      
      if (onWalletConnect) {
        onWalletConnect(address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Is Freighter installed and unlocked?",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const viewOnExplorer = () => {
    if (walletAddress) {
      const explorerUrl = `https://stellar.expert/explorer/testnet/account/${walletAddress}`;
      window.open(explorerUrl, '_blank');
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl mb-6">
      <h2 className="text-xl font-semibold mb-4">Connect XLM Wallet</h2>
      
      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-gray-400">
            Connect your Freighter Wallet to {userType === "user" ? "make payments" : "receive payments"} with XLM.
          </p>
          
          <div className="text-xs text-gray-400 flex items-center gap-1 mb-4">
            <span>
              Don't have Freighter?{" "}
              <a 
                href="https://www.freighter.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-crypto-purple hover:underline"
              >
                Get Freighter Wallet
              </a>
            </span>
          </div>
          
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting || !stellarKit} 
            className="w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Freighter Wallet"}
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
              onClick={disconnectWallet}
            >
              Disconnect
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={viewOnExplorer}
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