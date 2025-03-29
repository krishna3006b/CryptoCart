
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Ready to Transform Your Payment Experience?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users and merchants who are already bridging the gap between 
              crypto and traditional payments with CryptoCart.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
