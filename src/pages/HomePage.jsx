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
    badge: "Profile & GPS",
    desc: "Sign up with your blood type, city, and GPS location.",
    highlights: ["Blood type & city", "GPS location", "Privacy protected"],
  },
  {
    step: "02",
    icon: "🆘",
    title: "SOS Emergency Alert",
    badge: "Instant Request",
    desc: "Post an emergency with patient name, blood type, hospital, and GPS location. Your request reaches matching donors within 50 KM instantly.",
    highlights: ["Patient details", "Urgency level", "Hospital GPS"],
  },
  {
    step: "03",
    icon: "📍",
    title: "Geo & Blood Matching",
    badge: "50 KM Radius",
    desc: "Donors see only emergencies matching their blood type within 50 KM of their GPS location sorted by distance, closest first.",
    highlights: ["Blood type match", "50 km radius", "Sorted by distance"],
  },
  {
    step: "04",
    icon: "🔔",
    title: "Real-Time Dashboard",
    badge: "Live Updates",
    desc: "Geo sorted emergencies and donor requests update live on your dashboard. No refresh needed see nearby alerts instantly.",
    highlights: ["Geo-sorted feed", "Direct requests", "Response tracking"],
  },
  {
    step: "05",
    icon: "🎯",
    title: "Targeted Donor Request",
    badge: "Direct Ask",
    desc: "Find a specific donor on the search page and send a direct request. They'll see it in their dashboard immediately.",
    highlights: ["Search donors", "One-click request", "Direct notification"],
  },
  {
    step: "06",
    icon: "✅",
    title: "Donor Responds",
    badge: "Privacy Protected",
    desc: "When you click 'I Can Donate', send notification to requester.",
    highlights: ["Phone revealed", "One-time share", "Full control"],
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
      <section className="py-24 px-4 relative">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-red-900/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-900/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Simple 6-Step Process
            </div>
            <h2 className="section-title mb-4">
              How <span className="text-white">LifeDrop</span> Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A privacy-first platform that connects blood requesters with
              nearby donors — in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                className="glass p-6 relative group hover:border-red-900/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Step Number Decorator */}
                <div className="absolute top-3 right-3 text-5xl font-outfit font-black text-white/5 select-none pointer-events-none leading-none">
                  {step.step}
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1 group-hover:scale-110 transition-transform duration-200">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-500 text-xs font-bold font-mono">
                        Step {step.step}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full border border-red-900/40">
                        {step.badge}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-3">
                      {step.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.highlights.map((h, j) => (
                        <span
                          key={j}
                          className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded-full border border-white/5"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY BANNER ───────────────────────────── */}
      {/* <section className="py-16 px-4">
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
      </section> */}

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
          <span>🫀</span> Become a Donor Today
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
