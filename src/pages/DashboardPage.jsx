// ────────────────────────────────────────────────────────────
// LifeDrop — Dashboard Page
// ────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../services/firebase";

const BLOOD_TYPE_COLORS = {
  "A+": "text-red-400",
  "A-": "text-rose-400",
  "B+": "text-orange-400",
  "B-": "text-amber-400",
  "AB+": "text-purple-400",
  "AB-": "text-violet-400",
  "O+": "text-blue-400",
  "O-": "text-cyan-400",
};

const StatCard = ({ icon, label, value, color = "text-red-400" }) => (
  <div className="glass p-6 flex items-center gap-4 hover:border-red-900/40 transition-all duration-300 hover:-translate-y-0.5">
    <div className="text-3xl">{icon}</div>
    <div>
      <div className={`text-2xl font-outfit font-extrabold ${color}`}>
        {value}
      </div>
      <div className="text-slate-400 text-xs">{label}</div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const isDonor = profile?.role === "donor";

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(true);

  useEffect(() => {
    if (!user || !profile) return;

    // 1. Fetch my SOS requests
    const qMyReq = query(
      collection(db, "sos_requests"),
      where("requesterId", "==", user.uid),
    );
    const unsubMyReq = onSnapshot(qMyReq, (snapshot) => {
      setMyRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // 2. If donor, fetch matching active alerts
    let unsubAlerts = () => {};
    if (isDonor && profile.bloodType) {
      const qAlerts = query(
        collection(db, "sos_requests"),
        where("status", "==", "open"),
        where("bloodType", "==", profile.bloodType),
      );
      unsubAlerts = onSnapshot(qAlerts, (snapshot) => {
        // Filter out the donor's own requests just in case
        const matches = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((r) => r.requesterId !== user.uid);
        setActiveAlerts(matches);
        setLoadingFeeds(false);
      });
    } else {
      setLoadingFeeds(false);
    }

    return () => {
      unsubMyReq();
      unsubAlerts();
    };
  }, [user, profile, isDonor]);

  const handleRespond = async (requestId) => {
    try {
      const reqRef = doc(db, "sos_requests", requestId);
      await updateDoc(reqRef, {
        respondedDonors: arrayUnion({
          uid: user.uid,
          name: profile.name,
          phone: profile.phone || "", // Reveal phone ONLY when responding
          timestamp: new Date().toISOString(),
        }),
      });
      alert(
        "Response sent! The patient/hospital has received your contact details.",
      );
    } catch (err) {
      alert("Failed to respond: " + err.message);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-dark p-10 text-center max-w-md">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="font-outfit font-bold text-xl text-white mb-3">
            Complete Your Profile
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Your account is set up but your profile is incomplete. Register as a
            donor or start requesting blood.
          </p>
          <Link
            to="/register"
            id="dashboard-complete-profile-btn"
            className="btn-LifeDrop px-6 py-3 rounded-xl"
          >
            Complete Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Welcome Header */}
      <div className="animate-fadeInUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👋</span>
          <div>
            <h1 className="font-outfit font-extrabold text-3xl text-white">
              Hello, {profile?.name || "there"}!
            </h1>
            <p className="text-slate-400 text-sm">
              {isDonor
                ? "You are registered as a blood donor 🩸"
                : "Emergency Blood Requester"}
            </p>
          </div>
        </div>
      </div>
      {console.log("profile", profile)}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeInUp delay-100">
        <StatCard
          icon="🩸"
          label="Blood Type"
          value={profile?.bloodType || "—"}
          color={BLOOD_TYPE_COLORS[profile?.bloodType] || "text-red-400"}
        />
        <StatCard
          icon="🎁"
          label="Total Donations"
          value={profile?.donationCount || 0}
          color="text-green-400"
        />
        <StatCard
          icon="📍"
          label="City"
          value={profile?.city || "—"}
          color="text-blue-400"
        />
        <StatCard
          icon={profile?.isAvailable ? "✅" : "🔴"}
          label="Availability"
          value={profile?.isAvailable ? "Available" : "Unavailable"}
          color={profile?.isAvailable ? "text-green-400" : "text-red-400"}
        />
      </div>

      {/* Main Feeds Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp delay-200">
        {/* Left Column: Feeds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Emergencies (For Donors) */}
          {isDonor && (
            <div className="glass p-6">
              <h3 className="font-outfit font-bold text-xl text-white mb-4 flex items-center gap-2">
                <span className="animate-pulse-red text-red-500">🚨</span>{" "}
                Active Emergencies Near You
              </h3>

              {loadingFeeds ? (
                <p className="text-slate-400 text-sm">Loading emergencies...</p>
              ) : activeAlerts.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <div className="text-4xl mb-2">🌿</div>
                  <p className="text-slate-400 text-sm">
                    No active matching emergencies right now.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAlerts.map((alert) => {
                    const hasResponded = alert.respondedDonors?.some(
                      (d) => d.uid === user.uid,
                    );
                    return (
                      <div
                        key={alert.id}
                        className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                              {alert.bloodType}
                            </span>
                            <span className="text-white font-semibold">
                              {alert.hospital}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-1">
                            {alert.patientName} needs {alert.unitsNeeded} units
                          </p>
                          <p className="text-slate-500 text-xs">
                            {alert.city} • Contact: {alert.contactPhone}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRespond(alert.id)}
                          disabled={hasResponded}
                          className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                            hasResponded
                              ? "bg-white/10 text-slate-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                          }`}
                        >
                          {hasResponded ? "✓ Responded" : "I Can Donate"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* My SOS Requests */}
          <div className="glass p-6">
            <h3 className="font-outfit font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span>📋</span> Your Active SOS Alerts
            </h3>

            {loadingFeeds ? (
              <p className="text-slate-400 text-sm">Loading your alerts...</p>
            ) : myRequests.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                <p className="text-slate-400 text-sm">
                  You haven't posted any SOS alerts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-semibold">
                        For: {req.patientName} ({req.bloodType})
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${req.status === "open" ? "bg-green-900/50 text-green-400 border border-green-700" : "bg-slate-800 text-slate-400"}`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3 mt-3">
                      <p className="text-sm font-medium text-slate-300 mb-2">
                        Donor Responses ({req.respondedDonors?.length || 0})
                      </p>
                      {req.respondedDonors?.length > 0 ? (
                        <div className="space-y-2">
                          {req.respondedDonors.map((donor, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-black/20 p-2 rounded text-sm"
                            >
                              <span className="text-slate-300">
                                {donor.name}
                              </span>
                              <a
                                href={`tel:${donor.phone}`}
                                className="text-green-400 hover:underline"
                              >
                                {donor.phone}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-xs">
                          Waiting for nearby donors to respond...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Details */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass p-6">
            <h3 className="font-outfit font-bold text-lg text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/sos"
                className="btn-LifeDrop w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>🆘</span> Create New SOS
              </Link>
              {isDonor && (
                <Link
                  to="/donor-profile"
                  className="btn-outline-LifeDrop w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <span>✏️</span> Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="glass p-6">
            <h3 className="font-outfit font-bold text-lg text-white mb-4">
              Your Details
            </h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: profile?.name || "—" },
                { label: "Email", value: user?.email || "—" },
                { label: "Blood Type", value: profile?.bloodType || "—" },
                { label: "City", value: profile?.city || "—" },
                { label: "Phone", value: profile?.phone || "—" },
                {
                  label: "Age/Weight",
                  value:
                    profile?.age && profile?.weight
                      ? `${profile.age}y / ${profile.weight}kg`
                      : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-b border-white/5 pb-2 last:border-0 last:pb-0"
                >
                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-white text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
