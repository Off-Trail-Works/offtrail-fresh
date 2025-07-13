"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Redirect to contacts page after successful login
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo and Branding */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-financial-blue-600 to-financial-blue-700 rounded-xl flex items-center justify-center shadow-financial mx-auto mb-4">
          <span className="text-white font-bold text-xl">OT</span>
        </div>
        <h1 className="text-2xl font-bold text-financial-gray-900 mb-2">
          Welcome to OffTrail
        </h1>
        <p className="text-financial-gray-600">
          Wealth Management Platform
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-xl shadow-financial border border-financial-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-financial-gray-900 mb-2">
            Sign In
          </h2>
          <p className="text-financial-gray-600 text-sm">
            Access your financial advisor dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-financial-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-financial-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="advisor@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-blue-500 focus:border-financial-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-financial-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-financial-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-blue-500 focus:border-financial-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-financial-gray-400 hover:text-financial-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-financial-red-50 border border-financial-red-200 rounded-lg p-3">
              <p className="text-sm text-financial-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-financial-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-financial-blue-700 focus:outline-none focus:ring-2 focus:ring-financial-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-financial-gray-200">
          <p className="text-center text-sm text-financial-gray-500">
            Need access?{" "}
            <a href="/create-advisor" className="text-financial-blue-600 hover:text-financial-blue-700 font-medium">
              Register as an advisor
            </a>
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-financial-gray-500">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
