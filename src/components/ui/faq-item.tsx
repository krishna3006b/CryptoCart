
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  className?: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("border-b border-white/10 py-4", className)}>
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={cn(
          "mt-2 text-gray-400 overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};
