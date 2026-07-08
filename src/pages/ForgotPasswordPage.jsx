// ────────────────────────────────────────────────────────────
// LifeDrop — Forgot Password Page
// ────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordByUsername } from "../services/authService";

const forgotPasswordSchema = z.object({
  username: z.string().trim().min(2, "Enter your username"),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await resetPasswordByUsername(data.username);
      setSuccess(true);
    } catch (err) {
      setError(
        err.message || "Could not send reset email. Please check your username."
      );
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
            <div className="text-5xl mb-4">🔑</div>
            <h1 className="font-outfit font-extrabold text-2xl text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your username and we'll send a password reset link
            </p>
          </div>

          {/* Success card */}
          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-green-900/30 border border-green-700 text-green-300 rounded-xl px-4 py-6 text-sm">
                <div className="text-3xl mb-2">📨</div>
                <h3 className="font-bold text-lg text-white mb-1">Check your inbox</h3>
                <p className="text-slate-300">
                  We've sent a password reset link to your registered email. Click the link in the email to set a new password.
                </p>
              </div>
              <Link
                to="/login"
                className="btn-LifeDrop block w-full py-3 rounded-xl font-semibold text-center text-sm"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Error banner */}
              {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* Username */}
              <div>
                <label
                  htmlFor="forgot-username"
                  className="block text-sm text-slate-300 mb-2 font-medium"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">@</span>
                  <input
                    id="forgot-username"
                    type="text"
                    placeholder="yourname"
                    autoComplete="username"
                    {...register("username")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/10 transition-all"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-LifeDrop w-full py-3 rounded-xl font-semibold cursor-pointer"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
