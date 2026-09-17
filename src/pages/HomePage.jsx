// ────────────────────────────────────────────────────────────
// LifeDrop — Home / Landing Page
// ────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import usePageSEO from "../hooks/usePageSEO";

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

// Blood type compatibility — donor → recipients they can give to
const COMPATIBILITY = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

const IMPACT_FACTS = [
  { icon: "💉", stat: "1 donation", detail: "saves up to 3 lives" },
  {
    icon: "⏱️",
    stat: "Every 2 sec",
    detail: "someone in Pakistan needs blood",
  },
  { icon: "🩸", stat: "Only 1%", detail: "of Pakistanis donate blood" },
  { icon: "🏥", stat: "50% shortage", detail: "in rural hospitals nationwide" },
];

const DONOR_CARDS = [
  {
    name: "Ahmed K.",
    city: "Lahore",
    type: "O+",
    quote:
      "Within 10 minutes of registering, I received my first SOS alert. I donated and the family called me a hero.",
  },
  {
    name: "Sara M.",
    city: "Karachi",
    type: "B-",
    quote:
      "LifeDrop found a compatible donor for my brother within 20 minutes. No hospital blood bank had his type.",
  },
  {
    name: "Usman R.",
    city: "Islamabad",
    type: "AB+",
    quote:
      "I love that my phone number stays private. I choose when to share it — full control is everything.",
  },
];

const FAQS = [
  // {
  //   q: "How is my privacy protected?",
  //   a: "Your phone number is NEVER shown publicly. It is only revealed to the person who posted an SOS request after you personally click 'I Can Donate'. You are in full control at all times.",
  // },
  {
    q: "How do I get notified of SOS alerts?",
    a: "LifeDrop uses browser push notifications. When an SOS is posted that matches your blood type and is within 50 KM of your GPS location, you receive an instant push notification — even if the app is closed.",
  },
  {
    q: "Who can see my profile information?",
    a: "Only your name, blood type, city, and availability status are visible to other registered users when they search for donors. Your exact GPS coordinates and phone number are never exposed.",
  },
  {
    q: "What are the eligibility requirements to donate?",
    a: "You must be between 18–65 years old, weigh at least 50 kg, and be in good health. We also ask for your last donation date to ensure the platform recommends safe donation intervals (typically every 3 months).",
  },
  {
    q: "What is an SOS Alert?",
    a: "An SOS Alert is an emergency blood request posted by someone who needs blood urgently — for a patient in a hospital. Matching nearby donors are notified instantly so they can volunteer to help.",
  },
  {
    q: "Can I use LifeDrop if I am not a donor?",
    a: "Yes! Anyone can register and post an SOS Alert for a patient. You don't have to be a blood donor yourself to use the platform for emergencies.",
  },
  {
    q: "Is LifeDrop free to use?",
    a: "Completely free — always. LifeDrop is a community-driven platform built to save lives, not to generate profit.",
  },
];

// ── FAQ accordion item ───────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`glass border transition-all duration-300 overflow-hidden ${
        open ? "border-red-900/50" : "border-white/5 hover:border-white/10"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left group"
      >
        <span className="text-white font-medium text-sm leading-snug group-hover:text-red-300 transition-colors">
          {q}
        </span>
        <span
          className={`text-red-400 text-xl flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
            {a}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Page component ───────────────────────────────────────────
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [hoveredDonor, setHoveredDonor] = useState(null);

  usePageSEO({
    title: "LifeDrop — Emergency Blood Donor Network · Pakistan",
    description:
      "Pakistan's Emergency Blood Donor Network. Find verified blood donors near you instantly with real-time geo-location matching and SOS alerts.",
    canonicalPath: "/",
  });

  return (
    <div className="overflow-hidden">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-900/20 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-8 animate-fadeInUp">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Pakistan&apos;s Emergency Blood Network
          </div>

          <h1 className="section-title mb-6 animate-fadeInUp delay-100 leading-tight">
            Every Second Counts.
            <br />
            <span className="text-white">Find Blood Donors</span>
            <br />
            <span style={{ color: "var(--LifeDrop-red-light)" }}>
              Near You Instantly.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fadeInUp delay-200 leading-relaxed">
            LifeDrop connects emergency blood requesters with nearby donors
            using real-time geo-location matching and instant push notifications
            with full donor privacy protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-300">
            {isAuthenticated ? (
              <>
                <Link
                  to="/sos"
                  id="hero-sos-btn"
                  className="btn-LifeDrop px-8 py-4 rounded-xl md:text-lg text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>🆘</span> Post SOS Alert
                </Link>
                <Link
                  to="/dashboard"
                  id="hero-dashboard-btn"
                  className="btn-outline-LifeDrop px-8 py-4 rounded-xl md:text-lg text-sm font-bold inline-flex items-center gap-2"
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
      <section className="px-4">
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
              nearby donors in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                className="glass p-6 relative group hover:border-red-900/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
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

      {/* ── BLOOD COMPATIBILITY CHART ─────────────────── */}
      <section className="py-24 px-4 relative border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-red-900/10 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Blood Compatibility
            </div>
            <h2 className="section-title mb-4">
              Who Can You <span className="text-white">Donate To?</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Hover or tap a donor row to see all compatible recipients. O- is
              the universal donor every person can receive it.
            </p>
          </div>

          <div className="glass p-4 md:p-8">
            {/* Column headers */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-20 flex-shrink-0 text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                Donor ↓
              </div>
              <div className="flex-1 grid grid-cols-8 gap-1.5">
                {BLOOD_TYPES.map((t) => (
                  <div
                    key={t}
                    className="text-center text-[10px] font-bold text-slate-500"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix rows */}
            <div className="space-y-1.5">
              {Object.entries(COMPATIBILITY).map(([donor, recipients]) => (
                <div
                  key={donor}
                  className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 cursor-default ${
                    hoveredDonor === donor
                      ? "bg-red-900/20 border border-red-900/40"
                      : "border border-transparent hover:bg-white/3"
                  }`}
                  onMouseEnter={() => setHoveredDonor(donor)}
                  onMouseLeave={() => setHoveredDonor(null)}
                >
                  <div className="w-20 flex-shrink-0">
                    <span
                      className={`inline-flex items-center justify-center w-12 h-7 rounded-lg text-xs font-bold transition-colors duration-200 ${
                        hoveredDonor === donor
                          ? "bg-red-600 text-white"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {donor}
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-8 gap-1.5">
                    {BLOOD_TYPES.map((recipient) => {
                      const ok = recipients.includes(recipient);
                      return (
                        <div
                          key={recipient}
                          title={
                            ok
                              ? `${donor} → ${recipient} ✓`
                              : `${donor} → ${recipient} X`
                          }
                          className={`h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                            ok
                              ? hoveredDonor === donor
                                ? "bg-green-500/30 border border-green-500/60 text-green-300"
                                : "bg-green-900/20 border border-green-900/40 text-green-500"
                              : "bg-red-500/10 border border-white/5 text-slate-700"
                          }`}
                        >
                          {ok ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="text-red-500">X</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-5 h-5 rounded bg-green-900/20 border border-green-900/40 flex items-center justify-center text-green-500 font-bold text-[10px]">
                  ✓
                </div>
                Compatible
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-5 h-5 rounded bg-red-900/20 border border-red-900/40 flex items-center justify-center text-red-500 font-bold text-[10px]">
                  X
                </div>
                Not compatible
              </div>
              <p className="ml-auto text-xs text-slate-600 hidden sm:block">
                💡 Hover a row to highlight
              </p>
            </div>
          </div>

          {/* Universal donor callout */}
          <div className="mt-5 glass-dark p-5 flex items-center gap-4">
            <div className="text-3xl flex-shrink-0">🌍</div>
            <div>
              <p className="text-white font-semibold text-sm">
                O- is the Universal Donor
              </p>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                O- red blood cells can be given to anyone regardless of blood
                type — making O- donors critically valuable in emergencies when
                there&apos;s no time to test the patient&apos;s blood type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY DONATE ───────────────────────────────── */}
      <section className="py-24 px-4 relative border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Real Impact
            </div>
            <h2 className="section-title mb-4">
              Why Your Blood <span className="text-white">Matters</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Blood cannot be manufactured. Every drop that saves a life comes
              from a generous volunteer like you.
            </p>
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {IMPACT_FACTS.map((f, i) => (
              <div
                key={i}
                className="glass p-6 text-center group hover:border-red-900/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <div className="text-red-400 font-outfit font-extrabold text-lg">
                  {f.stat}
                </div>
                <div className="text-slate-400 text-xs mt-1 leading-snug">
                  {f.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Donor stories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DONOR_CARDS.map((d, i) => (
              <div
                key={i}
                className="glass p-6 hover:border-red-900/30 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
              >
                <div className="text-red-900/60 text-5xl font-serif leading-none select-none">
                  &ldquo;
                </div>
                <p className="text-slate-300 text-sm leading-relaxed -mt-4">
                  {d.quote}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-red-900/40 border border-red-900/50 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
                    {d.type}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{d.name}</p>
                    <p className="text-slate-500 text-xs">{d.city}</p>
                  </div>
                  <span className="ml-auto text-[10px] bg-green-900/30 text-green-400 border border-green-900/40 px-2 py-0.5 rounded-full">
                    Verified Donor
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="py-24 px-4 relative border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[350px] h-[350px] rounded-full bg-red-900/8 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Got Questions?
            </div>
            <h2 className="section-title mb-4">
              Frequently Asked <span className="text-white">Questions</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Everything you need to know about LifeDrop — from privacy to
              eligibility to how push alerts work.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="mt-10 glass p-6 text-center">
            <p className="text-slate-400 text-sm mb-4">
              Still have questions? The best way to understand LifeDrop is to
              try it registration takes under 2 minutes.
            </p>
            <Link
              to="/register"
              id="faq-register-cta"
              className="btn-LifeDrop px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
            >
              <span>🩸</span> Register Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="py-24 px-4 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6 animate-heartbeat">🫀</div>
          <h2 className="section-title mb-6">Ready to Save a Life?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Join thousands of blood donors in Pakistan who are making a
            difference. Every registration brings us closer to a zero blood
            shortage future.
          </p>
          <Link
            to="/register"
            id="footer-cta-btn"
            className="btn-LifeDrop px-10 py-4 rounded-xl md:text-lg text-sm font-bold inline-flex items-center gap-2 animate-pulse-red"
          >
            <span>🫀</span> Become a Donor Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
