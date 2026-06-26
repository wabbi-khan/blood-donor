// ────────────────────────────────────────────────────────────
// LifeDrop — Auth Context
// Provides auth state throughout the app
// ────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { onAuthChange, getUserProfile } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchIdRef = useRef(0);
  const userRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      fetchIdRef.current += 1;
      const currentFetch = fetchIdRef.current;

      userRef.current = firebaseUser;
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (currentFetch === fetchIdRef.current) {
            setProfile(userProfile);
          }
        } catch (err) {
          if (currentFetch === fetchIdRef.current) {
            console.warn(
              "[LifeDrop] Could not fetch user profile (check Firestore rules):",
              err.message,
            );
            setProfile(null);
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const uid = userRef.current?.uid;
    if (uid) {
      fetchIdRef.current += 1;
      const updated = await getUserProfile(uid);
      setProfile(updated);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isDonor: profile?.role === "donor",
    isRequester: profile?.role === "requester",
    refreshProfile,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-heartbeat text-6xl mb-4">🫀</div>
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
