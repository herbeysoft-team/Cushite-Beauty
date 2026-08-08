import { createContext, useContext, useEffect, useState } from "react";
import { watchAuthState, loginUser, registerUser, logoutUser } from "../services/firebase/auth";
import { getUserProfile } from "../services/firebase/firestore";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { uid, name, email, role }
  const [loading, setLoading] = useState(true); // true until first auth check resolves

  useEffect(() => {
    const unsubscribe = watchAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(firebaseUser.uid);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: profile?.name || firebaseUser.displayName,
        role: profile?.role || "customer",
      });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (credentials) => loginUser(credentials);
  const register = (details) => registerUser(details);
  const logout = () => logoutUser();

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthContext;
