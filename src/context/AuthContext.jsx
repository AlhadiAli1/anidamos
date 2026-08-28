import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authCtx";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/.netlify/functions/me", { credentials: "include" });
      const data = await response.json();

      if (!response.ok || !data?.user) {
        setUser(null);
        return null;
      }

      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (form) => {
    const response = await fetch("/.netlify/functions/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Invalid username or password.");
    }

    setUser(data.user);
    setAuthOpen(false);
    return data.user;
  }, []);

  const register = useCallback(async (form) => {
    const response = await fetch("/.netlify/functions/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Unable to create your account.");
    }

    setUser(data.user);
    setAuthOpen(false);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/.netlify/functions/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      authOpen,
      openAuth: () => setAuthOpen(true),
      closeAuth: () => setAuthOpen(false),
      login,
      register,
      logout,
      refreshUser,
    }),
    [authOpen, loading, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
