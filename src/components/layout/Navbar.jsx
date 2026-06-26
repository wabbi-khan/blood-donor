// ────────────────────────────────────────────────────────────
// LifeDrop — Navbar Component
// ────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { logOut } from "../../services/authService";

// const BloodDropIcon = () => (
//   <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-red-500">
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8l7 4-7 4z" />
//     <path d="M12 2.1C9.17 2.1 6.6 3.64 5.17 6L12 22l6.83-16C17.4 3.64 14.83 2.1 12 2.1z" />
//   </svg>
// );

const Navbar = () => {
  const { isAuthenticated, profile, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 font-medium text-sm ${
      isActive
        ? "text-red-400 border-b-2 border-red-500"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 m-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="animate-heartbeat text-3xl">🫀</div>
            <span className="text-xl font-extrabold font-outfit tracking-wider text-white group-hover:text-red-400 transition-colors">
              LifeDrop
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              Emergency Blood Network
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/sos" className={navLinkClass}>
                  SOS Alert
                </NavLink>
                <NavLink to="/search-donors" className={navLinkClass}>
                  Find Donors
                </NavLink>
                {profile?.role === "donor" && (
                  <NavLink to="/donor-profile" className={navLinkClass}>
                    My Profile
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {profile?.name || user?.email || "User"}
                </span>
                <button
                  id="navbar-logout-btn"
                  onClick={handleLogout}
                  className="btn-outline-LifeDrop text-xs px-4 py-2 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="navbar-login-btn"
                  className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  id="navbar-register-btn"
                  className="btn-LifeDrop text-xs px-4 py-2 rounded-lg"
                >
                  Register as Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="navbar-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-white transition-colors p-2"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2 animate-fadeInUp">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <div className="py-2 px-2">Home</div>
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="py-2 px-2">Dashboard</div>
                </NavLink>
                <NavLink
                  to="/sos"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="py-2 px-2">SOS Alert</div>
                </NavLink>
                <NavLink
                  to="/search-donors"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="py-2 px-2">Find Donors</div>
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-red-400 font-medium text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="py-2 px-2">Login</div>
                </NavLink>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="py-2 px-2">Register as Donor</div>
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
