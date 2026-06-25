// ────────────────────────────────────────────────────────────
// LifeDrop — Donor Profile Page
// ────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrUpdateUserProfile } from "../services/authService";
import { useAuth } from "../store/AuthContext";

const profileSchema = z.object({
  name: z.string().min(2, "Name required"),
  city: z.string().min(2, "City required"),
  age: z.coerce.number().min(18).max(65),
  weight: z.coerce.number().min(50),
  lastDonationDate: z.string().optional(),
  isAvailable: z.boolean(),
});

const DonorProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(profile?.location || null);
  const [locLoading, setLocLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      city: profile?.city || "",
      age: profile?.age || "",
      weight: profile?.weight || "",
      lastDonationDate: profile?.lastDonationDate || "",
      isAvailable: profile?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        city: profile.city || "",
        age: profile.age || "",
        weight: profile.weight || "",
        lastDonationDate: profile.lastDonationDate || "",
        isAvailable: profile.isAvailable ?? true,
      });
      setLocation(profile.location || null);
    }
  }, [profile, reset]);

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
    setError("");
    setLoading(true);
    try {
      let isAvailable = data.isAvailable;
      if (data.lastDonationDate) {
        const donationTime = new Date(data.lastDonationDate).getTime();
        const sixMonthsInMs = 180 * 24 * 60 * 60 * 1000;
        if (Date.now() - donationTime < sixMonthsInMs) {
          isAvailable = false;
        }
      }

      await createOrUpdateUserProfile(user, {
        ...data,
        isAvailable, // Override if needed
        lastDonationDate: data.lastDonationDate || null,
        ...(location ? { location } : {}),
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-outfit font-extrabold text-3xl text-white mb-2">
          Donor Profile
        </h1>
        <p className="text-slate-400 text-sm">
          Keep your profile updated to receive accurate emergency match
          notifications
        </p>
      </div>

      <div className="glass-dark p-8">
        {/* Blood Type Badge (read-only) */}
        <div className="flex items-center gap-4 mb-8 glass p-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-red-900/40 border-2 border-red-700 flex items-center justify-center text-2xl font-outfit font-extrabold text-red-400">
            {profile?.bloodType || "—"}
          </div>
          <div>
            <p className="text-white font-semibold">
              {profile?.name || "Donor"}
            </p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <p className="text-slate-500 text-xs mt-1">
              Blood type can only be changed by contacting support
            </p>
          </div>
        </div>

        {/* Success/Error */}
        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm mb-6">
            ✅ Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form
          id="donor-profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm text-slate-300 mb-1 font-medium"
            >
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              {...register("name")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* City, Age, Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label
                htmlFor="profile-city"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                City
              </label>
              <input
                id="profile-city"
                type="text"
                {...register("city")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all text-sm"
              />
              {errors.city && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="profile-age"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Age
              </label>
              <input
                id="profile-age"
                type="number"
                {...register("age")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all text-sm"
              />
              {errors.age && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="profile-weight"
                className="block text-sm text-slate-300 mb-1 font-medium"
              >
                Weight (kg)
              </label>
              <input
                id="profile-weight"
                type="number"
                {...register("weight")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all text-sm"
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
              htmlFor="profile-last-donation"
              className="block text-sm text-slate-300 mb-1 font-medium"
            >
              Last Donation Date
            </label>
            <input
              id="profile-last-donation"
              type="date"
              {...register("lastDonationDate")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all text-sm [color-scheme:dark]"
            />
            <p className="text-slate-500 text-xs mt-1">
              If within the last 6 months, you will be automatically marked
              unavailable.
            </p>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between glass p-4 rounded-xl">
            <div>
              <p className="text-white font-medium text-sm">
                Available for Donation
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Toggle off if you are temporarily unavailable
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="profile-available"
                type="checkbox"
                {...register("isAvailable")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
            </label>
          </div>

          {/* Update Location */}
          <div>
            <label className="block text-sm text-slate-300 mb-2 font-medium">
              GPS Location
            </label>
            <button
              id="profile-update-location-btn"
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
                  ? `✅ Location: (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}) — Click to update`
                  : "📍 Update My Location"}
            </button>
          </div>

          <button
            id="profile-save-btn"
            type="submit"
            disabled={loading}
            className="btn-LifeDrop w-full py-3 rounded-xl font-semibold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorProfilePage;
