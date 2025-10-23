import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock, Eye, EyeOff, User, MapPin } from "lucide-react";
import logo from '../../assets/Logo.png';
import { motion } from "motion/react";
import { toast } from "sonner";
import { register as registerSvc } from "../../service/handler";

interface RegisterPageProps {
  onRegister: (userData: any) => void;
  onLoginClick: () => void;
}

export function RegisterPage({ onRegister, onLoginClick }: RegisterPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // All fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      valid: hasUpperCase && hasLowerCase && hasNumber && hasSymbol && password.length >= 8,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol,
      hasMinLength: password.length >= 8,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!address.trim()) newErrors.address = "Address is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match!";

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid)
      newErrors.password = "Password must include uppercase, lowercase, number, and symbol";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const resp = await registerSvc({ name: fullName, email, password, address });

      if (resp.success) {
        toast.success("Registration successful", {
          description: resp.messages?.join(", ") || "Account created. Please log in."
        });
        onRegister(resp.data);
      } else {
        toast.error("Registration failed", {
          description: resp.errors?.join(", ") || resp.messages?.join(", ") || "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-accent-50/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 md:p-10 shadow-2xl border-2 border-primary-100/50 bg-card/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <motion.div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center border-2 border-primary-200 shadow-lg">
                <img src={logo} alt="WeeMeS Logo" className="w-12 h-12 object-contain" />
              </div>
            </motion.div>
            <h2 className="text-2xl text-foreground mb-2">Create Account</h2>
            <p className="text-sm text-muted-foreground">Join WeeMeS to manage your wealth</p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  required
                  className={`pl-10 h-11 border-2 focus:border-primary-500 transition-colors ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="address"
                  type="text"
                  placeholder="City or Region"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className={`pl-10 h-11 border-2 focus:border-primary-500 transition-colors ${
                    errors.address ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`pl-10 pr-10 h-11 border-2 focus:border-primary-500 transition-colors ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`pl-10 pr-10 h-11 border-2 focus:border-primary-500 transition-colors ${
                    errors.confirmPassword ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading || password !== confirmPassword}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Create Account"
              )}
            </Button>
          </motion.form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
