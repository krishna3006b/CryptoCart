
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface ReferralInputProps {
  referralCode: string;
  setReferralCode: (code: string) => void;
}

export const ReferralInput: React.FC<ReferralInputProps> = ({
  referralCode,
  setReferralCode,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="referral">Referral Code (Optional)</Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Users size={18} />
        </div>
        <Input
          id="referral"
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code if you have one"
          className="pl-10"
        />
      </div>
      <p className="text-xs text-gray-400">
        Earn 50 RP points when you sign up with a referral code
      </p>
    </div>
  );
};
