import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/assets/logo";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, User, Lock, Mail, Store } from "lucide-react";
import axios from 'axios';

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"user" | "merchant">("user");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all required fields");
      }

      const response = await axios.post(`http://localhost:5000/api/register`, {
        email,
        password,
        type: userType, // Send userType to backend
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      toast({
        title: "Account created",
        description: `Welcome to XLM Pay Connect, ${name || email}!`,
      });

      if (userType === "user") {
        navigate("/dashboard");
      } else {
        navigate("/merchant");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Signup failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-dark p-4">
      <div className="glass-card rounded-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join XLM Pay Connect today</p>
        </div>

        <div className="flex w-full rounded-md overflow-hidden mb-6">
          <button
            className={`flex-1 py-2 text-center transition-colors ${
              userType === "user" 
                ? "bg-crypto-purple text-white" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setUserType("user")}
          >
            User
          </button>
          <button
            className={`flex-1 py-2 text-center transition-colors ${
              userType === "merchant" 
                ? "bg-crypto-purple text-white" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setUserType("merchant")}
          >
            Merchant
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">
              {userType === "user" ? "Full Name" : "Business Name"}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {userType === "user" ? <User size={18} /> : <Store size={18} />}
              </div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={userType === "user" ? "Enter your name" : "Enter business name"}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-crypto-purple"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the{" "}
                <a href="#" className="text-crypto-purple hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-crypto-purple hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-crypto-purple hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;