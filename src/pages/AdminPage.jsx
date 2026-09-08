// ────────────────────────────────────────────────────────────
// LifeDrop — Admin Dashboard Page
// ────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  FiUsers,
  FiAlertCircle,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

const formatDate = (ts) => {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Badge = ({ label, color }) => {
  const colors = {
    green: "bg-green-900/40 text-green-300 border-green-700/50",
    red: "bg-red-900/40 text-red-300 border-red-700/50",
    yellow: "bg-yellow-900/40 text-yellow-300 border-yellow-700/50",
    blue: "bg-blue-900/40 text-blue-300 border-blue-700/50",
    slate: "bg-slate-800/60 text-slate-400 border-slate-700/50",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.slate}`}
    >
      {label}
    </span>
  );
};

const statusBadge = (status) => {
  const map = {
    open: { label: "Open", color: "red" },
    accepted: { label: "Accepted", color: "green" },
    closed: { label: "Closed", color: "slate" },
    fulfilled: { label: "Fulfilled", color: "blue" },
  };
  const cfg = map[status] || { label: status || "Unknown", color: "slate" };
  return <Badge label={cfg.label} color={cfg.color} />;
};

const availBadge = (avail) =>
  avail ? (
    <Badge label="Available" color="green" />
  ) : (
    <Badge label="Unavailable" color="slate" />
  );

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass p-5 flex items-center gap-4 hover:border-red-900/40 transition-all duration-300 hover:-translate-y-0.5">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-2xl font-outfit font-extrabold text-white">
        {value}
      </div>
      <div className="text-slate-400 text-xs mt-0.5">{label}</div>
    </div>
  </div>
);

const UsersTable = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {[
            "#",
            "Name",
            "Username",
            "Blood Type",
            "City",
            "Role",
            "Availability",
            "Joined",
          ].map((h) => (
            <th
              key={h}
              className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {users.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="py-10 text-center text-slate-500 text-sm"
            >
              No users found.
            </td>
          </tr>
        ) : (
          users.map((u, i) => (
            <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
              <td className="py-3 px-4 text-slate-500">{i + 1}</td>
              <td className="py-3 px-4 text-white font-medium whitespace-nowrap">
                {u.name || u.displayName || "—"}
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                {u.username || u.email || "—"}
              </td>
              <td className="py-3 px-4">
                {u.bloodType ? (
                  <span className="font-bold text-red-400">{u.bloodType}</span>
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                {u.city || "—"}
              </td>
              <td className="py-3 px-4">
                <Badge
                  label={u.role || "user"}
                  color={u.role === "admin" ? "blue" : "slate"}
                />
              </td>
              <td className="py-3 px-4">{availBadge(u.isAvailable)}</td>
              <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                {formatDate(u.createdAt)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const SOSTable = ({ requests }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {[
            "#",
            "Patient Name",
            "Blood Type",
            "City",
            "Hospital",
            "Status",
            "Urgency",
            "Created",
          ].map((h) => (
            <th
              key={h}
              className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {requests.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="py-10 text-center text-slate-500 text-sm"
            >
              No SOS requests found.
            </td>
          </tr>
        ) : (
          requests.map((r, i) => (
            <tr key={r.id} className="hover:bg-white/[0.03] transition-colors">
              <td className="py-3 px-4 text-slate-500">{i + 1}</td>
              <td className="py-3 px-4 text-white font-medium whitespace-nowrap">
                {r.patientName || r.requesterName || "—"}
              </td>
              <td className="py-3 px-4">
                {r.bloodType ? (
                  <span className="font-bold text-red-400">{r.bloodType}</span>
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                {r.city || "—"}
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                {r.hospital || "—"}
              </td>
              <td className="py-3 px-4">{statusBadge(r.status)}</td>
              <td className="py-3 px-4">
                {r.urgency === "critical" ? (
                  <Badge label="Critical" color="red" />
                ) : r.urgency === "urgent" ? (
                  <Badge label="Urgent" color="yellow" />
                ) : (
                  <Badge label={r.urgency || "Normal"} color="slate" />
                )}
              </td>
              <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                {formatDate(r.createdAt)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const DonorRequestsTable = ({ requests }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {[
            "#",
            "Requester",
            "Target Donor",
            "Blood Type",
            "City",
            "Status",
            "Message",
            "Created",
          ].map((h) => (
            <th
              key={h}
              className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {requests.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="py-10 text-center text-slate-500 text-sm"
            >
              No donor requests found.
            </td>
          </tr>
        ) : (
          requests.map((r, i) => (
            <tr key={r.id} className="hover:bg-white/[0.03] transition-colors">
              <td className="py-3 px-4 text-slate-500">{i + 1}</td>
              <td className="py-3 px-4 text-white font-medium whitespace-nowrap">
                {r.requesterName || "—"}
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                {r.targetDonorName || "—"}
              </td>
              <td className="py-3 px-4">
                {r.bloodType ? (
                  <span className="font-bold text-red-400">{r.bloodType}</span>
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                {r.city || "—"}
              </td>
              <td className="py-3 px-4">{statusBadge(r.status)}</td>
              <td className="py-3 px-4 text-slate-400 max-w-[180px] truncate">
                {r.message || "—"}
              </td>
              <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                {formatDate(r.createdAt)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const TABS = [
  { id: "users", label: "Users", icon: FiUsers },
  { id: "sos", label: "SOS Requests", icon: FiAlertCircle },
  { id: "donor_requests", label: "Donor Requests", icon: FiActivity },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false),
    );
    const unsubSOS = onSnapshot(
      query(collection(db, "sos_requests"), orderBy("createdAt", "desc")),
      (snap) =>
        setSosRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    const unsubDonor = onSnapshot(
      query(collection(db, "donor_requests"), orderBy("createdAt", "desc")),
      (snap) =>
        setDonorRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => {
      unsubUsers();
      unsubSOS();
      unsubDonor();
    };
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      !search ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.bloodType || "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredSOS = sosRequests.filter(
    (r) =>
      !search ||
      (r.patientName || r.requesterName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (r.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.bloodType || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.status || "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredDonorRequests = donorRequests.filter(
    (r) =>
      !search ||
      (r.requesterName || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.targetDonorName || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.bloodType || "").toLowerCase().includes(search.toLowerCase()),
  );

  const openSOS = sosRequests.filter((r) => r.status === "open").length;
  const availableDonors = users.filter((u) => u.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-white mb-1">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time overview of all platform activity
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <FiRefreshCw
            className="w-3 h-3 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          Live data
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={users.length}
          color="bg-blue-900/30 text-blue-400"
        />
        <StatCard
          icon={FiUsers}
          label="Available Donors"
          value={availableDonors}
          color="bg-green-900/30 text-green-400"
        />
        <StatCard
          icon={FiAlertCircle}
          label="Open SOS Requests"
          value={openSOS}
          color="bg-red-900/30 text-red-400"
        />
        <StatCard
          icon={FiActivity}
          label="Direct Requests"
          value={donorRequests.length}
          color="bg-purple-900/30 text-purple-400"
        />
      </div>

      <div className="glass-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/10">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 flex-wrap">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count =
                tab.id === "users"
                  ? users.length
                  : tab.id === "sos"
                    ? sosRequests.length
                    : donorRequests.length;
              return (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-red-900/50 text-red-300 border border-red-700/50" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            id="admin-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all"
          />
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-5xl animate-heartbeat mb-4">🩸</div>
                <p className="text-slate-400 text-sm">Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "users" && (
                <>
                  <p className="text-slate-400 text-sm mb-4">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {filteredUsers.length}
                    </span>{" "}
                    of {users.length} users
                  </p>
                  <UsersTable users={filteredUsers} />
                </>
              )}
              {activeTab === "sos" && (
                <>
                  <p className="text-slate-400 text-sm mb-4">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {filteredSOS.length}
                    </span>{" "}
                    of {sosRequests.length} SOS requests
                  </p>
                  <SOSTable requests={filteredSOS} />
                </>
              )}
              {activeTab === "donor_requests" && (
                <>
                  <p className="text-slate-400 text-sm mb-4">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {filteredDonorRequests.length}
                    </span>{" "}
                    of {donorRequests.length} donor requests
                  </p>
                  <DonorRequestsTable requests={filteredDonorRequests} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
