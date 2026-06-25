// ────────────────────────────────────────────────────────────
// LifeDrop — 404 Not Found Page
// ────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center px-4 text-center">
    <div>
      <div className="text-8xl mb-6 animate-float">🩸</div>
      <h1 className="font-outfit font-extrabold text-5xl text-white mb-4">
        404
      </h1>
      <h2 className="font-outfit font-bold text-2xl text-slate-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-slate-400 max-w-sm mx-auto mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        id="notfound-home-btn"
        className="btn-LifeDrop px-8 py-3 rounded-xl font-semibold inline-block"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
