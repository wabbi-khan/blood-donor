// ────────────────────────────────────────────────────────────
// LifeDrop — Home / Landing Page
// ────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STATS = [
  { number: "50KM", label: "Radius Coverage" },
  { number: "< 2min", label: "Notification Speed" },
  { number: "0", label: "Phone Numbers Exposed" },
  { number: "24/7", label: "Emergency Response" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📋",
    title: "Donor Registers",
    desc: "Sign up with your blood type, phone, and GPS location. Your number stays private.",
  },
  {
    step: "02",
    icon: "🆘",
    title: "SOS Alert Sent",
    desc: "A requester posts an emergency with blood type and hospital location.",
  },
  {
    step: "03",
    icon: "📍",
    title: "Smart Matching",
    desc: "Our system finds compatible donors within 10–50 KM radius using geo-matching.",
  },
  {
    step: "04",
    icon: "🔔",
    title: "Push Notification",
    desc: "Matched donors receive an instant browser push notification.",
  },
  {
    step: "05",
    icon: "✅",
    title: "Donor Confirms",
    desc: 'When the donor clicks "I am On My Way", only then is their phone revealed.',
  },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-hidden">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-900/20 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-8 animate-fadeInUp">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Pakistan&apos;s Emergency Blood Network
          </div>

          {/* Headline */}
          <h1 className="section-title mb-6 animate-fadeInUp delay-100 leading-tight">
            Every Second Counts.
            <br />
            <span className="text-white">Find Blood Donors</span>
            <br />
            <span style={{ color: "var(--LifeDrop-red-light)" }}>
              Near You — Instantly.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fadeInUp delay-200 leading-relaxed">
            LifeDrop connects emergency blood requesters with nearby donors
            using real-time geo-location matching and instant push notifications
            — with full donor privacy protection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-300">
            {isAuthenticated ? (
              <>
                <Link
                  to="/sos"
                  id="hero-sos-btn"
                  className="btn-LifeDrop px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2"
                >
                  <span>🆘</span> Post SOS Alert
                </Link>
                <Link
                  to="/dashboard"
                  id="hero-dashboard-btn"
                  className="btn-outline-LifeDrop px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
                >
                  <span>📋</span> My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  id="hero-register-btn"
                  className="btn-LifeDrop px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2"
                >
                  <span>🩸</span> Register as Donor
                </Link>
                <Link
                  to="/login"
                  id="hero-login-btn"
                  className="btn-outline-LifeDrop px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
                >
                  <span>🆘</span> Need Blood Now?
                </Link>
              </>
            )}
          </div>

          {/* Blood Type Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-14 animate-fadeInUp delay-400">
            {BLOOD_TYPES.map((type) => (
              <div
                key={type}
                className="glass w-14 h-14 rounded-full flex items-center justify-center text-red-400 font-bold text-sm border border-red-900/40 hover:border-red-500/60 hover:scale-110 transition-all duration-200 cursor-default"
              >
                {type}
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs mt-3">All blood types covered</p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-16 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="glass text-center py-8 px-4 hover:border-red-900/40 transition-all duration-300 group"
            >
              <div className="text-3xl md:text-4xl font-outfit font-extrabold text-red-400 group-hover:scale-110 transition-transform duration-200">
                {s.number}
              </div>
              <div className="text-slate-400 text-sm mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How LifeDrop Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A simple, privacy-first flow that saves lives in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                className="glass p-6 text-center relative group hover:border-red-900/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {step.icon}
                </div>
                <div className="text-red-500 text-xs font-bold font-mono mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY BANNER ───────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-dark p-10 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-900/20 blur-2xl pointer-events-none" />
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-outfit font-extrabold text-2xl text-white mb-3">
              Donor Privacy is Sacred
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Donor phone numbers are{" "}
              <strong className="text-red-400">NEVER</strong> shown publicly.
              Your number is only shared with the requester after you click{" "}
              <strong className="text-green-400">
                &ldquo;I am On My Way&rdquo;
              </strong>
              . You are in full control.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="py-24 px-4 text-center">
        <h2 className="section-title mb-6">Ready to Save a Life?</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Join thousands of blood donors in Pakistan who are making a
          difference.
        </p>
        <Link
          to="/register"
          id="footer-cta-btn"
          className="btn-LifeDrop px-10 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2 animate-pulse-red"
        >
          <span>🩸</span> Become a Donor Today
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
