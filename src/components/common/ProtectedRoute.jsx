// ────────────────────────────────────────────────────────────
// LifeDrop — Protected Route Component
// Redirects to /login if user is not authenticated
// ────────────────────────────────────────────────────────────
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-heartbeat mb-4">🩸</div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Profile is complete if it has phone, bloodType, and city
  const isProfileComplete = profile && profile.phone && profile.bloodType && profile.city;

  if (!isProfileComplete && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  if (isProfileComplete && location.pathname === "/complete-profile") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
