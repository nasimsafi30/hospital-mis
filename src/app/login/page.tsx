"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Hospital, Loader2, ArrowRight, Shield, Activity, Heart, Stethoscope } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const lockTimer = useRef<any>(null);

  // Security: Sanitize input
  const sanitize = (value: string) => value.trim().replace(/[<>'"]/g, "");

  // Security: Rate limiting
  const checkRateLimit = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= 5) {
      setLocked(true);
      setError("Too many attempts. Please wait 30 seconds.");
      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => {
        setLocked(false);
        setAttempts(0);
        setError("");
      }, 30000);
      return false;
    }
    return true;
  };

  // Security: Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Security: Validate password strength
  const validatePassword = (password: string) => {
    return password.length >= 6 && password.length <= 128;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if locked
    if (locked) {
      setError("Account temporarily locked. Please wait.");
      return;
    }

    // Rate limiting
    if (!checkRateLimit()) return;

    // Sanitize inputs
    const cleanEmail = sanitize(email);
    const cleanPassword = password; // Don't trim password - spaces might be intentional

    // Validate
    if (!cleanEmail) { setError("Email is required"); setIsLoading(false); return; }
    if (!validateEmail(cleanEmail)) { setError("Invalid email format"); setIsLoading(false); return; }
    if (!cleanPassword) { setError("Password is required"); setIsLoading(false); return; }
    if (!validatePassword(cleanPassword)) { setError("Password must be 6-128 characters"); setIsLoading(false); return; }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      
      const data = await res.json();

      if (data.success) {
        // Reset attempts on success
        setAttempts(0);
        
        // Store token securely
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Set session expiry (24 hours)
        const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("tokenExpiry", expiry.toString());
        
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.2),transparent_70%)]" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-12">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Hospital className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Hospital MIS</h1>
                <p className="text-blue-300/80 text-sm mt-1">Management Information System</p>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Smart Healthcare<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Management Starts Here</span>
            </h2>
            <p className="text-lg text-blue-100/70 mb-12 leading-relaxed max-w-md">
              Streamline patient care, manage appointments, track inventory, and handle billing — all in one powerful platform.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Activity, label: "Patients Managed", value: "10,000+", color: "from-blue-400 to-blue-600" },
                { icon: Heart, label: "Appointments Today", value: "156", color: "from-red-400 to-pink-600" },
                { icon: Stethoscope, label: "Uptime", value: "99.9%", color: "from-green-400 to-emerald-600" },
                { icon: Shield, label: "Support", value: "24/7", color: "from-purple-400 to-violet-600" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }} whileHover={{ scale: 1.03, y: -2 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-blue-200/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md">
          
          <div className="lg:hidden text-center mb-8">
            <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-500/25" whileHover={{ scale: 1.05 }}>
              <Hospital className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Hospital MIS</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 mb-4 shadow-lg" whileHover={{ rotate: 10 }}>
                  <Shield className="h-7 w-7 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-blue-200/60 mt-1">Sign in to your account</p>
                {locked && <p className="text-red-400 text-sm mt-2">🔒 Temporarily locked</p>}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300 text-center backdrop-blur-sm">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-blue-100">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/50" />
                    <Input type="email" placeholder="admin@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-blue-300/30 focus:border-blue-500" required disabled={isLoading || locked} autoComplete="email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-blue-100">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/50" />
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-11 pr-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-blue-300/30 focus:border-blue-500" required disabled={isLoading || locked} autoComplete="current-password" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-300/50 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 border-0" disabled={isLoading || locked}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="flex items-center gap-2">Sign In<ArrowRight className="h-4 w-4" /></span>}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}