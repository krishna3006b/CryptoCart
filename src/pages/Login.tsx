import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/assets/logo";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import axios from 'axios';

const Login: React.FC = () => {
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
      // Validate inputs
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Make API call to backend
      const response = await axios.post(`http://localhost:5000/api/login`, {
        email,
        password,
      });

      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      toast({
        title: "Success",
        description: `Logged in as ${userType}.`,
      });

      // Redirect to appropriate dashboard
      if (userType === "user") {
        navigate("/dashboard");
      } else {
        navigate("/merchant");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Login failed",
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
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={18} />
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
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-crypto-purple hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-crypto-purple hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;