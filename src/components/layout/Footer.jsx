// ────────────────────────────────────────────────────────────
// LifeDrop — Footer Component
// ────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-white/10 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl">🩸</span>
          <span className="font-outfit font-bold text-white text-lg">
            LifeDrop
          </span>
          <span className="text-slate-400 text-sm">
            Emergency Blood Network
          </span>
        </div>
        <p className="text-slate-500 text-sm text-center">
          Built for Pakistan — Saving lives through instant blood donor
          matching.
        </p>
        <p className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} LifeDrop. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
