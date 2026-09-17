// ────────────────────────────────────────────────────────────
// LifeDrop — PageLoader (Suspense fallback)
// ────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0f0f1a]">
    <div className="animate-heartbeat text-6xl select-none">🫀</div>
    <p className="text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">
      Loading…
    </p>
  </div>
);

export default PageLoader;
