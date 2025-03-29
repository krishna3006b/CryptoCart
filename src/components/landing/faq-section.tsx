
import React from "react";
import { FAQItem } from "@/components/ui/faq-item";

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How does the escrow system work?",
      answer: "When a user makes a payment in XLM, the tokens are transferred to a secure escrow wallet rather than directly to the merchant. The merchant then sends the equivalent INR amount to the user's specified account and uploads proof. Once the user verifies receipt of the INR, the XLM is released from escrow to the merchant."
    },
    {
      question: "How is the XLM to INR rate calculated?",
      answer: "We fetch real-time exchange rates from CoinGecko's API to ensure fair and transparent pricing. The rate is locked in at the time of transaction initiation to protect both parties from rate fluctuations during the transaction process."
    },
    {
      question: "What happens if the merchant doesn't send the INR?",
      answer: "If a merchant fails to send the INR within the specified timeframe (usually 24 hours), the user can raise a dispute. Our system will investigate, and if the merchant is at fault, the XLM will be returned to the user's wallet."
    },
    {
      question: "What are Reputation Points (RP)?",
      answer: "To keep the ecosystem healthy, we have introduced a reputation system. Users and merchants earn RP for every successful transaction. Higher RP allows for larger transaction limits and better visibility in the marketplace. RP can also be used to unlock premium features."
    },
    {
      question: "Is my data and wallet information secure?",
      answer: "Absolutely. We implement industry-standard encryption and security protocols. We use Google Authenticator for 2FA, and our platform never stores private keys. All transaction data is encrypted, and we perform regular security audits."
    },
    {
      question: "How long does a typical transaction take?",
      answer: "The initial XLM transfer to escrow happens within seconds. The total transaction time depends on how quickly the merchant sends the INR payment and the user verifies it. Most transactions complete within a few hours, though same-day completion is common for active merchants."
    }
  ];

  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-crypto-purple/20 border border-crypto-purple/20 text-crypto-purple">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Find answers to common questions about XLM Pay Connect, our escrow system, and how transactions work.
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
