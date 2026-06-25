// ────────────────────────────────────────────────────────────
// LifeDrop — App Router
// ────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SOSPage from "./pages/SOSPage";
import DonorProfilePage from "./pages/DonorProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchDonorsPage from "./pages/SearchDonorsPage";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
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

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
