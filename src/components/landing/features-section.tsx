
import React from "react";
import { FeatureCard } from "@/components/ui/feature-card";
import { 
  Shield, 
  Zap, 
  BarChart3, 
  Scan, 
  Wallet, 
  Award 
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "XLM tokens are securely held in escrow until Fiat payment is verified, ensuring trust between parties."
    },
    {
      icon: Zap,
      title: "Instant Transactions",
      description: "Quick and seamless payments with real-time XLM to Fiat conversion rates from CoinGecko."
    },
    {
      icon: BarChart3,
      title: "Transaction History",
      description: "Comprehensive history with status tracking for all your payments and receipts."
    },
    {
      icon: Scan,
      title: "QR Code Scanning",
      description: "Simply scan a merchant's QR code to initiate payments without manual data entry."
    },
    {
      icon: Wallet,
      title: "Multi-wallet Support",
      description: "Connect multiple XLM wallets to manage your crypto assets efficiently."
    },
    {
      icon: Award,
      title: "Reputation Points (RP)",
      description: "Earn RP for every transaction and referral, allowing higher transaction limtis."
    }
  ];

  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-crypto-purple/20 border border-crypto-purple/20 text-crypto-purple">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            A Complete Crypto-Fiat Payment Ecosystem
          </h2>
          <p className="text-gray-400">
            Our platform bridges the gap between cryptocurrencies and traditional payment systems, 
            offering a comprehensive suite of features for both users and merchants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
