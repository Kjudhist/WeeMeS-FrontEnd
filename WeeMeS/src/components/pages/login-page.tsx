import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from '../../assets/Logo.png';
import { motion } from "motion/react";
import { login as loginSvc } from "../../service/handler";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
  onSignUp: () => void;
  onKYCNeeded: () => void;
  onDashboard: () => void;
}

export function LoginPage({ onLogin, onBack, onSignUp, onKYCNeeded, onDashboard }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const resp = await loginSvc(email, password);

      if (resp.success) {
        const custData = resp.data || {};

        // Store auth and user info in localStorage (full payload)
        localStorage.setItem("authToken", custData.token || "");
        localStorage.setItem("userName", custData.name ?? "");
        localStorage.setItem("userEmail", custData.email ?? "");
        // Compose userData with flags and risk profile
        const userData = {
          customerId: custData.customerId,
          name: custData.name,
          email: custData.email,
          kycComplete: Boolean(custData.kycComplete),
          crpComplete: Boolean(custData.crpComplete),
          riskProfile: custData.riskProfileType ?? null,
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        // Route based on kycComplete; only mark authenticated when going to dashboard
        if (userData.kycComplete) {
          localStorage.setItem("isAuthenticated", "true");
          onDashboard();
        } else {
          localStorage.setItem("isAuthenticated", "false");
          onKYCNeeded();
        }
      } else {
        setError(resp.messages?.join(", ") || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-accent-50/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 md:p-10 shadow-2xl border-2 border-primary-100/50 bg-card/95 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center border-2 border-primary-200 shadow-lg">
                <img src={logo} alt="WeeMeS Logo" className="w-12 h-12 object-contain" />
              </div>
            </motion.div>
            <h2 className="text-2xl text-foreground mb-2">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your WeeMeS account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <p className="text-sm text-destructive text-center">{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-11 border-2 focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={onSignUp}
                className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </Card>
        <Dialog open={showForgot} onOpenChange={setShowForgot}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Forgot Password</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-secondary-700">
              please contact our Customer Service to change your password
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}