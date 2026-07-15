"use client";

// Context is React's way of sharing state across the whole app
// Without context you'd have to pass user data through every component
// With context any component can access the logged in user directly

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { getProfile } from "@/lib/api";
import socket from "@/lib/socket";

// ── Shape of our auth context ──
interface AuthContextType {
  user: User | null; // the logged in user (null if not logged in)
  token: string | null; // the JWT token
  loading: boolean; // true while checking if user is logged in
  login: (token: string, user: User) => void; // call this after login
  logout: () => void; // call this to logout
  isJobseeker: boolean; // shortcut to check role
  isEmployer: boolean; // shortcut to check role
  isAdmin: boolean; // shortcut to check role
}

// ── Create the context ──
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ── Provider wraps the whole app ──
// Any component inside this provider can access auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });
  const [loading, setLoading] = useState<boolean>(true);

  // ── Check if user is already logged in on page load ──
  // When the page loads we check localStorage for a saved token
  // If found we fetch the user profile to verify the token is still valid
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((data) => {
        if (data._id) {
          setUser(data);
          // Connect socket and join personal room for notifications
          socket.connect();
          socket.emit("join-user", data._id);
        }
      })
      .catch(() => {
        // Token expired or invalid — clear everything
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    // Save to localStorage for API calls
    localStorage.setItem("token", newToken);

    // Save to cookie for middleware route protection
    document.cookie = `token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}`;

    setToken(newToken);
    setUser(newUser);

    socket.connect();
    socket.emit("join-user", newUser._id);
  };

  const logout = () => {
    localStorage.removeItem("token");

    // Clear cookie
    document.cookie = "token=; path=/; max-age=0";

    setToken(null);
    setUser(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isJobseeker: user?.role === "jobseeker",
        isEmployer: user?.role === "employer",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom hook ──
// Makes it easy to use auth in any component
// Instead of: const { user } = useContext(AuthContext)
// You write: const { user } = useAuth()
export const useAuth = () => useContext(AuthContext);
