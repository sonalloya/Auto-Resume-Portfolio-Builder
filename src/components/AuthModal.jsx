import { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff, X, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode with trigger prop
  useEffect(() => {
    setMode(initialMode);
    setError("");
    setSuccess("");
    // Clear inputs
    setName("");
    setEmail("");
    setPassword("");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Local database handlers
  const getRegisteredUsers = () => {
    const data = localStorage.getItem("registered_users");
    return data ? JSON.parse(data) : [];
  };

  const saveUser = (newUser) => {
    const users = getRegisteredUsers();
    users.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(users));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    // Simulate small premium delay for animations
    setTimeout(() => {
      const users = getRegisteredUsers();

      if (mode === "signup") {
        // Sign Up check
        const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
          setError("An account with this email already exists.");
          setLoading(false);
          return;
        }

        const newUser = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password, // simple storage for demo / local state
        };

        saveUser(newUser);
        setSuccess("✦ Account created successfully!");
        setLoading(false);

        // Delayed success callback
        setTimeout(() => {
          onSuccess(newUser);
          onClose();
        }, 1200);

      } else {
        // Login check
        const matchedUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!matchedUser) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }

        setSuccess("✦ Logged in successfully!");
        setLoading(false);

        // Delayed success callback
        setTimeout(() => {
          onSuccess(matchedUser);
          onClose();
        }, 1200);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in no-print">
      {/* Background glow elements */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[100px] -z-10 animate-pulse-glow pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-indigo-600/10 blur-[80px] -z-10 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />

      {/* Main Container */}
      <div 
        className="relative max-w-md w-full glass-dark border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-fade-up max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg mb-3">
            <Sparkles size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xs">
            {mode === "signup" 
              ? "Join us to build professional ATS-ready resumes and stunning portfolios in seconds." 
              : "Log in with your credentials to access your drafts and portfolios."}
          </p>
        </div>

        {/* Mode Toggler */}
        <div className="grid grid-cols-2 gap-1 bg-white/5 border border-white/5 rounded-2xl p-1 mb-6">
          <button
            onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              mode === "signup" 
                ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-white shadow-lg" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              mode === "login" 
                ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-white shadow-lg" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Login
          </button>
        </div>

        {/* Action Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Name Field (Sign Up Only) */}
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User size={13} className="text-violet-400" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 bg-white/5 border border-white/10 outline-none transition-all focus:bg-white/8 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail size={13} className="text-violet-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 bg-white/5 border border-white/10 outline-none transition-all focus:bg-white/8 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock size={13} className="text-violet-400" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-white placeholder-slate-500 bg-white/5 border border-white/10 outline-none transition-all focus:bg-white/8 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Inline Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-pulse">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 font-semibold text-sm rounded-xl relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{mode === "signup" ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-4 border-t border-white/5 text-slate-400 text-xs">
          {mode === "signup" ? (
            <span>
              Already have an account?{" "}
              <button 
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }} 
                className="text-violet-400 hover:text-violet-300 hover:underline font-bold transition-all"
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              New to AI Resume Builder?{" "}
              <button 
                onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} 
                className="text-violet-400 hover:text-violet-300 hover:underline font-bold transition-all"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
