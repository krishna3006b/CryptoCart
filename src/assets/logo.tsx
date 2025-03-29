
import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-crypto-purple to-crypto-purple-dark flex items-center justify-center">
        <div className="absolute inset-0 rounded-full animate-pulse-slow bg-crypto-neon/20"></div>
        <span className="text-white font-bold text-lg">X</span>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Crypto<span className="text-crypto-purple">Cart</span>
      </span>
    </div>
  );
};
