
import React from "react";
import { TestimonialCard } from "@/components/ui/testimonial-card";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "XLM Pay Connect has revolutionized how I accept payments in my store. The escrow system gives me confidence, and I receive INR while benefiting from crypto.",
      author: "Rajesh Singh",
      role: "Retail Store Owner",
    },
    {
      quote: "As someone who holds XLM, this platform allows me to actually use my crypto for real-world transactions while ensuring I get fair rates.",
      author: "Priya Sharma",
      role: "Crypto Enthusiast",
    },
    {
      quote: "The reward points system is an amazing bonus. I've earned enough RP through regular transactions to get substantial benefits.",
      author: "Vijay Patel",
      role: "Regular User",
    },
  ];

  return (
    <section className="py-20" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-crypto-purple/20 border border-crypto-purple/20 text-crypto-purple">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            What Our Users Are Saying
          </h2>
          <p className="text-gray-400">
            Hear from users and merchants who have transformed their payment experience with XLM Pay Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
