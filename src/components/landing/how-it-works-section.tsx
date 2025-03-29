
import React from "react";
import { ArrowRight } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Scan Merchant QR",
      description: "User scans the merchant's QR code to initiate the payment process.",
      color: "from-crypto-purple to-crypto-purple-dark"
    },
    {
      number: "02",
      title: "Enter Amount & Pay",
      description: "Enter the INR amount, view XLM conversion, and confirm payment.",
      color: "from-blue-600 to-blue-800"
    },
    {
      number: "03",
      title: "XLM to Escrow",
      description: "XLM tokens are transferred to a secure escrow wallet awaiting confirmation.",
      color: "from-indigo-600 to-indigo-800"
    },
    {
      number: "04",
      title: "Merchant Sends INR",
      description: "Merchant sends INR payment to the specified account and uploads proof.",
      color: "from-violet-600 to-violet-800"
    },
    {
      number: "05",
      title: "User Verifies",
      description: "User verifies the INR payment receipt and confirms the transaction.",
      color: "from-purple-600 to-purple-800"
    },
    {
      number: "06",
      title: "XLM Released",
      description: "XLM is released from escrow to the merchant, and both parties earn RP points.",
      color: "from-crypto-neon/70 to-crypto-neon"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-crypto-purple/20 border border-crypto-purple/20 text-crypto-purple">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Simple, Secure, and Seamless Process
          </h2>
          <p className="text-gray-400">
            Follow these steps to make crypto-to-INR payments using XLM Pay Connect, providing 
            security and convenience for both users and merchants.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-crypto-purple/50 to-crypto-neon/50 hidden md:block"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br text-white flex items-center justify-center font-bold text-xl z-10 border border-white/10 shadow-lg">
                  {step.number}
                </div>
                <div className="glass-card p-6 rounded-2xl flex-grow">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block text-crypto-purple/50 w-6 h-6 mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
