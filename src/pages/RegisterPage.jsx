// ────────────────────────────────────────────────────────────
// LifeDrop — Donor Registration Page (Email/Password)
// ────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp, createOrUpdateUserProfile } from "../services/authService";
import { useAuth } from "../store/AuthContext";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const registrationSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .regex(
        /^(\+92|0)[0-9]{10}$/,
        "Enter a valid Pakistani number (e.g. 03001234567)",
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      required_error: "Please select your blood type",
    }),
    city: z.string().min(2, "City is required"),
    age: z.coerce
      .number()
      .min(18, "Must be at least 18")
      .max(65, "Must be under 65"),
    weight: z.coerce.number().min(50, "Minimum weight is 50 kg"),
    lastDonationDate: z.string().optional(),
    agreeToTerms: z
      .boolean()
      .refine((v) => v === true, "You must agree to the terms"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registrationSchema) });

  const detectLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        setError("Could not detect location. Please allow location access.");
        setLocLoading(false);
      },
    );
  };

  const onSubmit = async (data) => {
    if (!location) {
      setError("GPS location is required for emergency matching.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let isAvailable = true;
      if (data.lastDonationDate) {
        const donationTime = new Date(data.lastDonationDate).getTime();
        const sixMonthsInMs = 180 * 24 * 60 * 60 * 1000;
        if (Date.now() - donationTime < sixMonthsInMs) {
          isAvailable = false;
        }
      }

      const user = await signUp(data.email, data.password, data.name);
      await createOrUpdateUserProfile(user, {
        name: data.name,
        phone: data.phone,
        bloodType: data.bloodType,
        city: data.city,
        age: data.age,
        weight: data.weight,
        lastDonationDate: data.lastDonationDate || null,
        role: "donor",
        location,
        isAvailable,
        donationCount: data.lastDonationDate ? 1 : 0,
      });
      await refreshProfile();
      navigate("/dashboard");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError(
          "An account with this email already exists. Please login instead.",
        );
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-900/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="glass-dark p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🩸</div>
            <h1 className="font-outfit font-extrabold text-2xl text-white mb-2">
              Register as a Donor
            </h1>
            <p className="text-slate-400 text-sm">
              Help save lives — your phone number stays private until you choose
              to act
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form
            id="register-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Ali Hassan"
                {...register("name")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="ali@example.com"
                autoComplete="email"
                {...register("email")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="reg-phone"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Phone Number{" "}
                <span className="text-slate-500">
                  (private — only shared when you respond)
                </span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                placeholder="03001234567"
                {...register("phone")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("password")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all text-sm"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="reg-confirm"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  Confirm
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">
                Blood Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center justify-center py-2 rounded-lg border cursor-pointer transition-all text-sm font-semibold ${
                      watch("bloodType") === type
                        ? "bg-red-900/50 border-red-500 text-red-300"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-red-900/60"
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register("bloodType")}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
              {errors.bloodType && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.bloodType.message}
                </p>
              )}
            </div>

            {/* City, Age, Weight */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="reg-city"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  City
                </label>
                <input
                  id="reg-city"
                  type="text"
                  placeholder="Lahore"
                  {...register("city")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all text-sm"
                />
                {errors.city && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="reg-age"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  Age
                </label>
                <input
                  id="reg-age"
                  type="number"
                  placeholder="25"
                  {...register("age")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all text-sm"
                />
                {errors.age && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="reg-weight"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  Weight (kg)
                </label>
                <input
                  id="reg-weight"
                  type="number"
                  placeholder="70"
                  {...register("weight")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all text-sm"
                />
                {errors.weight && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>

            {/* Last Donation Date */}
            <div>
              <label
                htmlFor="reg-last-donation"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Last Donation Date (Optional)
              </label>
              <input
                id="reg-last-donation"
                type="date"
                {...register("lastDonationDate")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all text-sm [color-scheme:dark]"
              />
              <p className="text-slate-500 text-xs mt-1">
                If within the last 6 months, you will be marked unavailable.
              </p>
            </div>

            {/* GPS Location */}
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">
                GPS Location
              </label>
              <button
                id="reg-detect-location-btn"
                type="button"
                onClick={detectLocation}
                disabled={locLoading}
                className={`w-full py-3 rounded-xl border text-sm font-medium transition-all ${
                  location
                    ? "bg-green-900/30 border-green-700 text-green-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-red-500/40 hover:text-white"
                }`}
              >
                {locLoading
                  ? "📍 Detecting..."
                  : location
                    ? `✅ Detected (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                    : "📍 Detect My Location"}
              </button>
              <p className="text-slate-500 text-xs mt-1">
                Required for emergency matching within 10–50 KM radius
              </p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="reg-terms"
                type="checkbox"
                {...register("agreeToTerms")}
                className="mt-0.5 accent-red-500 w-4 h-4 shrink-0"
              />
              <span className="text-slate-400 text-xs leading-relaxed">
                I agree that LifeDrop may contact me for blood emergencies near
                my area. My phone number will only be shared with the requester
                after I confirm I am on my way.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-xs">
                {errors.agreeToTerms.message}
              </p>
            )}

            <button
              id="reg-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-LifeDrop w-full py-3 rounded-xl font-semibold"
            >
              {loading ? "Creating Account..." : "Create Account & Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already a donor?{" "}
              <Link
                to="/login"
                id="reg-login-link"
                className="text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
