// ────────────────────────────────────────────────────────────
// LifeDrop — Login Page (Email/Password)
// ────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signInWithGoogle } from "../services/authService";
import { useAuth } from "../store/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  usernameOrEmail: z.string().trim().min(2, "Enter your username"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      const isProfileComplete =
        profile &&
        profile.phone &&
        profile.bloodType &&
        profile.city &&
        profile.location;
      if (isProfileComplete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/complete-profile", { replace: true });
      }
    }
  }, [user, authLoading, profile, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      // Auth route redirection handles profile completeness or dashboard route.
    } catch (err) {
      setError(err.message || "Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await signIn(data.usernameOrEmail, data.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
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

          {/* Error banner */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer md:text-lg text-sm"
          >
            <FcGoogle size={25} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              or
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form
            id="login-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm text-slate-300 mb-2 font-medium"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">
                  @
                </span>
                <input
                  id="login-email"
                  type="text"
                  placeholder="yourname"
                  autoComplete="username"
                  {...register("usernameOrEmail")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/10 transition-all"
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.usernameOrEmail.message}
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
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            {/* <div className="text-right">
              <Link
                to="/forgot-password"
                id="login-forgot-link"
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div> */}

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
