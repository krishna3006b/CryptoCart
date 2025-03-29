
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-20 relative overflow-hidden" id="hero">
      <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-center opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-crypto-purple/20 border border-crypto-purple/20 text-crypto-purple animate-fade-in">
            <span className="mr-2">✨</span>Revolutionary M2M Payments with XLM
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Bridge Crypto & Fiat for Seamless Payments
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            CryptoCart enables users to spend Stellar Lumens (XLM) for everyday transactions,
            while merchants receive Local Fiats through our secure escrow system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
          </div>
        </div>
        
        <div className="mt-14 glass-card p-5 rounded-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4">
              <CheckCircle2 className="w-5 h-5 text-crypto-neon mr-3 flex-shrink-0" />
              <p className="text-gray-300">Secure Escrow System</p>
            </div>
            <div className="flex items-center p-4">
              <CheckCircle2 className="w-5 h-5 text-crypto-neon mr-3 flex-shrink-0" />
              <p className="text-gray-300">Real-time XLM-FIAT Rates</p>
            </div>
            <div className="flex items-center p-4">
              <CheckCircle2 className="w-5 h-5 text-crypto-neon mr-3 flex-shrink-0" />
              <p className="text-gray-300">Earn Reputation Points (RP)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
