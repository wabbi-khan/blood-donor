// ────────────────────────────────────────────────────────────
// LifeDrop — App Router
// ────────────────────────────────────────────────────────────
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import PageLoader from "./components/common/PageLoader";

// ── Route-level code splitting ────────────────────────────
// Eager-load public pages — they render immediately on first visit
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Lazy-load protected / heavy pages — fetched only when navigated to
const DashboardPage        = lazy(() => import("./pages/DashboardPage"));
const SOSPage              = lazy(() => import("./pages/SOSPage"));
const DonorProfilePage     = lazy(() => import("./pages/DonorProfilePage"));
const SearchDonorsPage     = lazy(() => import("./pages/SearchDonorsPage"));
const CompleteProfilePage  = lazy(() => import("./pages/CompleteProfilePage"));
const ForgotPasswordPage   = lazy(() => import("./pages/ForgotPasswordPage"));
const AdminPage            = lazy(() => import("./pages/AdminPage"));
const NotFoundPage         = lazy(() => import("./pages/NotFoundPage"));

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute>
                  <CompleteProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sos"
              element={
                <ProtectedRoute>
                  <SOSPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor-profile"
              element={
                <ProtectedRoute>
                  <DonorProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-donors"
              element={
                <ProtectedRoute>
                  <SearchDonorsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin — owner only (role: "admin") */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

