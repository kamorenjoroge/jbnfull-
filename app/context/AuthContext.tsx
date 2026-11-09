"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MOCK_ADMINS, type AdminUser } from "@/lib/mock-auth";

type AuthCtx = {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>; // returns an error message, or null if OK
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);
const KEY = "jnb-admin-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On page load, check if someone is already logged in
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 500)); // feels like a real login
    const found = MOCK_ADMINS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!found) return "Wrong email or password.";

    const session: AdminUser = { email: found.email, name: found.name, role: found.role }; // never save the password
    localStorage.setItem(KEY, JSON.stringify(session));
    setUser(session);
    return null;
  }

  function logout() {
    localStorage.removeItem(KEY);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}