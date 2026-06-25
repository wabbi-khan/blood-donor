// ────────────────────────────────────────────────────────────
// LifeDrop — SOS Alert Page
// ────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../store/AuthContext";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  {
    value: "critical",
    label: "Critical (< 1 hour)",
    color: "text-red-400 border-red-700 bg-red-900/30",
  },
  {
    value: "urgent",
    label: "Urgent (few hours)",
    color: "text-orange-400 border-orange-700 bg-orange-900/20",
  },
  {
    value: "normal",
    label: "Normal (same day)",
    color: "text-yellow-400 border-yellow-700 bg-yellow-900/20",
  },
];

const sosSchema = z.object({
  patientName: z.string().min(2, "Patient name required"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  unitsNeeded: z.coerce.number().min(1, "At least 1 unit").max(10),
  hospital: z.string().min(3, "Hospital name required"),
  city: z.string().min(2, "City required"),
  urgency: z.enum(["critical", "urgent", "normal"]),
  contactPhone: z
    .string()
    .regex(/^\+92[0-9]{10}$/, "Valid Pakistani number required"),
  notes: z.string().optional(),
});

const SOSPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sosSchema),
    defaultValues: { urgency: "critical", unitsNeeded: 1 },
  });

  const detectLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        setError("Could not detect location.");
        setLocLoading(false);
      },
    );
  };

  const onSubmit = async (data) => {
    if (!location) {
      setError("Hospital location is required for donor matching.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...data,
        requesterId: user?.uid || "anonymous",
        location,
        status: "open",
        respondedDonors: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Remove undefined fields to prevent Firestore errors
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key],
      );

      await addDoc(collection(db, "sos_requests"), payload);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to post SOS. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-dark p-12 text-center max-w-md animate-fadeInUp">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="font-outfit font-extrabold text-2xl text-white mb-3">
            SOS Alert Posted!
          </h2>
          <p className="text-slate-300 mb-2">
            Your emergency has been broadcast to nearby donors.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Eligible donors within 50 KM have been notified via push
            notification. You&apos;ll be contacted when a donor responds.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              id="sos-success-dashboard-btn"
              className="btn-LifeDrop px-6 py-3 rounded-xl"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setSuccess(false)}
              id="sos-success-new-btn"
              className="btn-outline-LifeDrop px-6 py-3 rounded-xl"
            >
              Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-900/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="glass-dark p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl animate-pulse-red mb-4">🆘</div>
            <h1 className="font-outfit font-extrabold text-2xl text-white mb-2">
              Post Emergency SOS
            </h1>
            <p className="text-slate-400 text-sm">
              Fill in details to find compatible donors near your hospital
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form
            id="sos-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Patient Name */}
            <div>
              <label
                htmlFor="sos-patient"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Patient Name
              </label>
              <input
                id="sos-patient"
                type="text"
                placeholder="Muhammad Ali"
                {...register("patientName")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.patientName && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.patientName.message}
                </p>
              )}
            </div>

            {/* Blood Type + Units */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sos-blood-type"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  Blood Type Needed
                </label>
                <select
                  id="sos-blood-type"
                  {...register("bloodType")}
                  className="w-full bg-[#0f3460] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all"
                >
                  <option value="">Select</option>
                  {BLOOD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.bloodType && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.bloodType.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="sos-units"
                  className="block text-sm text-slate-300 mb-1 font-medium"
                >
                  Units Needed
                </label>
                <input
                  id="sos-units"
                  type="number"
                  min={1}
                  max={10}
                  {...register("unitsNeeded")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all"
                />
                {errors.unitsNeeded && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.unitsNeeded.message}
                  </p>
                )}
              </div>
            </div>

            {/* Hospital */}
            <div>
              <label
                htmlFor="sos-hospital"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Hospital Name
              </label>
              <input
                id="sos-hospital"
                type="text"
                placeholder="Services Hospital Lahore"
                {...register("hospital")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.hospital && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.hospital.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="sos-city"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                City
              </label>
              <input
                id="sos-city"
                type="text"
                placeholder="Lahore"
                {...register("city")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.city && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">
                Urgency Level
              </label>
              <div className="space-y-2">
                {URGENCY_LEVELS.map(({ value, label, color }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${watch("urgency") === value ? color : "border-white/10 bg-white/5 text-slate-400"}`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("urgency")}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label
                htmlFor="sos-contact"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Contact Phone
              </label>
              <input
                id="sos-contact"
                type="tel"
                placeholder="+92 300 1234567"
                {...register("contactPhone")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
              />
              {errors.contactPhone && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            {/* Hospital Location */}
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">
                Hospital Location (GPS)
              </label>
              <button
                id="sos-detect-location-btn"
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
                    ? `✅ Location Set (${location.lat.toFixed(3)}, ${location.lng.toFixed(3)})`
                    : "📍 Detect Hospital Location"}
              </button>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="sos-notes"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Additional Notes (optional)
              </label>
              <textarea
                id="sos-notes"
                rows={3}
                placeholder="Any special instructions or information..."
                {...register("notes")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all resize-none"
              />
            </div>

            <button
              id="sos-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-LifeDrop w-full py-4 rounded-xl font-bold text-lg"
            >
              {loading ? "Broadcasting SOS..." : "🆘 Broadcast Emergency Alert"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
