// ────────────────────────────────────────────────────────────
// LifeDrop — Login Page (Email/Password)
// ────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, resetPassword } from "../services/authService";
import { useAuth } from "../store/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      const code = err.code || "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a moment.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = getValues("email");
    if (!email) {
      setError("Enter your email above first, then click Forgot Password.");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError("");
    } catch {
      setError("Could not send reset email. Check the email address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-900/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="glass-dark p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl animate-heartbeat mb-4">🩸</div>
            <h1 className="font-outfit font-extrabold text-2xl text-white mb-2">
              Welcome Back to LifeDrop
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in to access your dashboard and respond to emergencies
            </p>
          </div>

          {/* Success banner */}
          {resetSent && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm mb-6">
              ✅ Password reset email sent! Check your inbox.
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form
            id="login-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm text-slate-300 mb-2 font-medium"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="ali@example.com"
                autoComplete="email"
                {...register("email")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/10 transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm text-slate-300 mb-2 font-medium"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/10 transition-all"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                id="login-forgot-btn"
                onClick={handleResetPassword}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-LifeDrop w-full py-3 rounded-xl font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              New donor?{" "}
              <Link
                to="/register"
                id="login-register-link"
                className="text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
