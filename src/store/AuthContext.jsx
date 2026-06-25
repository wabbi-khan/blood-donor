// ────────────────────────────────────────────────────────────
// LifeDrop — Auth Context
// Provides auth state throughout the app
// ────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange, getUserProfile } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setProfile(userProfile);
        } catch (err) {
          console.warn(
            "[LifeDrop] Could not fetch user profile (check Firestore rules):",
            err.message,
          );
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isDonor: profile?.role === "donor",
    isRequester: profile?.role === "requester",
    refreshProfile: async () => {
      if (user) {
        const updated = await getUserProfile(user.uid);
        setProfile(updated);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
