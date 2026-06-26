import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { distanceBetween } from "geofire-common";
import { db } from "../services/firebase";
import { useAuth } from "../store/AuthContext";
import SearchableCitySelect from "../components/common/SearchableCitySelect";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const URGENCY_LEVELS = [
  { value: "critical", label: "🔴 Critical", color: "border-red-500 bg-red-900/20" },
  { value: "urgent", label: "🟠 Urgent", color: "border-orange-500 bg-orange-900/20" },
  { value: "normal", label: "🟢 Normal", color: "border-green-500 bg-green-900/20" },
];

const SearchDonorsPage = () => {
  const { user, profile } = useAuth();
  const [bloodType, setBloodType] = useState("");
  const [city, setCity] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [requestTarget, setRequestTarget] = useState(null);
  const [requestForm, setRequestForm] = useState({
    patientName: "",
    hospital: "",
    contactPhone: "",
    urgency: "urgent",
    unitsNeeded: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const detectLocation = () => {
    setLocLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCity(""); // Clear city if using GPS
        setLocLoading(false);
      },
      () => {
        setError(
          "Could not detect location. Please allow location access or type your city.",
        );
        setLocLoading(false);
      },
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bloodType) {
      setError("Please select a blood type.");
      return;
    }
    setError("");
    setLoading(true);
    setHasSearched(true);
    setDonors([]);

    try {
      // Query donors by bloodType and availability
      const q = query(
        collection(db, "users"),
        where("role", "==", "donor"),
        where("bloodType", "==", bloodType),
      );

      const snapshot = await getDocs(q);
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      // Exclude current user from results
      results = results.filter((donor) => donor.id !== user.uid);

      // Filter by city client-side to avoid index requirement errors on composite queries
      if (city) {
        results = results.filter(
          (donor) => donor.city?.toLowerCase() === city.toLowerCase(),
        );
      }

      // Filter by radius (50km) and sort if using "Near Me" GPS
      if (userLocation) {
        const radiusInKm = 50;
        results = results
          .map((donor) => {
            if (donor.location && donor.location.lat && donor.location.lng) {
              const distInKm = distanceBetween(
                [userLocation.lat, userLocation.lng],
                [donor.location.lat, donor.location.lng],
              );
              return { ...donor, distance: distInKm };
            }
            return { ...donor, distance: null };
          })
          .filter(
            (donor) => donor.distance !== null && donor.distance <= radiusInKm,
          )
          .sort((a, b) => a.distance - b.distance);
      }

      setDonors(results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!requestTarget || !user) return;
    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "donor_requests"), {
        patientName: requestForm.patientName,
        bloodType: requestTarget.bloodType,
        unitsNeeded: requestForm.unitsNeeded,
        hospital: requestForm.hospital,
        city: requestTarget.city,
        urgency: requestForm.urgency,
        contactPhone: requestForm.contactPhone,
        requesterId: user.uid,
        requesterName: profile?.name || "Anonymous",
        targetDonorId: requestTarget.id,
        targetDonorName: requestTarget.name,
        status: "open",
        respondedDonors: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setRequestTarget(null);
        setRequestSuccess(false);
        setRequestForm({
          patientName: "",
          hospital: "",
          contactPhone: "",
          urgency: "urgent",
          unitsNeeded: 1,
        });
      }, 2000);
    } catch (err) {
      setError("Failed to send request: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openRequestModal = (donor) => {
    setRequestTarget(donor);
    setRequestSuccess(false);
    setRequestForm({
      patientName: "",
      hospital: "",
      contactPhone: "",
      urgency: "urgent",
      unitsNeeded: 1,
    });
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24 pb-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-900/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl space-y-8">
        {/* Search Box */}
        <div className="glass-dark p-6 sm:p-8 rounded-2xl animate-fadeInUp">
          <div className="text-center mb-6">
            <h1 className="font-outfit font-extrabold text-3xl text-white mb-2">
              Find Blood Donors
            </h1>
            <p className="text-slate-400">
              Search for available donors near you by blood group
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full">
              <label className="block text-sm text-slate-300 mb-1 font-medium">
                Blood Type *
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full bg-[#0f3460] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all"
              >
                <option value="">Select Blood Type</option>
                {BLOOD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <label className="block text-sm text-slate-300 mb-1 font-medium">
                City
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <SearchableCitySelect
                  value={city}
                  onChange={(val) => {
                    setCity(val);
                    setUserLocation(null);
                  }}
                  disabled={!!userLocation}
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locLoading}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
                    userLocation
                      ? "bg-green-900/30 border-green-700 text-green-400"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-red-500/40 hover:text-white"
                  }`}
                >
                  {locLoading
                    ? "..."
                    : userLocation
                      ? "✅ Near Me"
                      : "📍 Near Me"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-LifeDrop w-full md:w-auto px-8 py-3 rounded-xl font-bold h-[50px] mt-2 md:mt-0"
            >
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && !loading && (
          <div className="space-y-4 animate-fadeInUp">
            <h2 className="text-xl font-semibold text-white px-2">
              Results ({donors.length})
            </h2>

            {donors.length === 0 ? (
              <div className="glass-dark p-12 text-center rounded-2xl">
                <div className="text-5xl mb-4">🏜️</div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No Donors Found
                </h3>
                <p className="text-slate-400">
                  Try adjusting your search criteria or checking back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donors.map((donor) => {
                  const isAvail = donor.isAvailable;
                  return (
                    <div
                      key={donor.id}
                      className={`glass-dark p-6 rounded-2xl flex flex-col justify-between border border-white/5 transition-all ${!isAvail ? "opacity-70 grayscale-[0.5]" : "hover:border-red-500/30"}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white capitalize flex items-center gap-2">
                              {donor.name}
                              {!isAvail && (
                                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                                  Unavailable
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-slate-400 flex items-center gap-1 mt-1 capitalize">
                              📍 {donor.city}
                              {donor.distance !== undefined && (
                                <span className="text-red-400 ml-1">
                                  ({donor.distance.toFixed(1)} km away)
                                </span>
                              )}
                            </p>
                          </div>
                          <div
                            className={`font-bold px-3 py-1.5 rounded-lg shadow-inner ${isAvail ? "bg-red-900/40 text-red-400 border border-red-800/50" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
                          >
                            {donor.bloodType}
                          </div>
                        </div>

                        <div className="text-sm text-slate-300 space-y-1.5 mb-6 bg-black/20 p-3 rounded-xl">
                          <p className="flex justify-between">
                            <span>Last Donation:</span>{" "}
                            <span className="text-white font-medium">
                              {donor.lastDonationDate
                                ? new Date(
                                    donor.lastDonationDate,
                                  ).toLocaleDateString()
                                : "Never/Unknown"}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span>Age:</span>{" "}
                            <span className="text-white font-medium">
                              {donor.age || "N/A"} yrs
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span>Weight:</span>{" "}
                            <span className="text-white font-medium">
                              {donor.weight || "N/A"} kg
                            </span>
                          </p>
                        </div>
                      </div>

                      {isAvail ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openRequestModal(donor)}
                            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            🩸 Request Donor
                          </button>
                          <a
                            href={`tel:${donor.phone}`}
                            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600 hover:text-white transition-colors"
                          >
                            📞 Call Donor ({donor.phone})
                          </a>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        >
                          ⛔ Currently Unavailable
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {requestTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-dark p-6 sm:p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {requestSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-outfit font-bold text-xl text-white mb-2">
                  Request Sent!
                </h3>
                <p className="text-slate-400 text-sm">
                  Your request has been sent to {requestTarget.name}.
                  They will see it on their dashboard.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-outfit font-bold text-lg text-white">
                    Request {requestTarget.name}
                  </h3>
                  <button
                    onClick={() => setRequestTarget(null)}
                    className="text-slate-400 hover:text-white text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-3 mb-6 text-sm">
                  <span className="text-slate-400">Donor:</span>{" "}
                  <span className="text-white font-medium">
                    {requestTarget.name}
                  </span>{" "}
                  —{" "}
                  <span className="text-red-400 font-bold">
                    {requestTarget.bloodType}
                  </span>
                  , {requestTarget.city}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1 font-medium">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={requestForm.patientName}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          patientName: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1 font-medium">
                      Hospital *
                    </label>
                    <input
                      type="text"
                      placeholder="Hospital name"
                      value={requestForm.hospital}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          hospital: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1 font-medium">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="03001234567"
                      value={requestForm.contactPhone}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1 font-medium">
                        Urgency
                      </label>
                      <select
                        value={requestForm.urgency}
                        onChange={(e) =>
                          setRequestForm({
                            ...requestForm,
                            urgency: e.target.value,
                          })
                        }
                        className="w-full bg-[#0f3460] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all"
                      >
                        {URGENCY_LEVELS.map((u) => (
                          <option key={u.value} value={u.value}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1 font-medium">
                        Units Needed
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={requestForm.unitsNeeded}
                        onChange={(e) =>
                          setRequestForm({
                            ...requestForm,
                            unitsNeeded: Number(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/60 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRequest}
                    disabled={
                      submitting ||
                      !requestForm.patientName ||
                      !requestForm.hospital ||
                      !requestForm.contactPhone
                    }
                    className="btn-LifeDrop w-full py-3 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "🩸 Send Request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDonorsPage;
