"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";
import { jwtDecode } from "jwt-decode";

export interface MyJwtPayload {
  userId: number;
  tenantId: number;
  roles: string[];
}

interface AuthContextType {
  token: string | null;
  userId: number | null;
  tenantId: number | null;
  roles: string[];
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<MyJwtPayload | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("token");

    startTransition(() => {
      if (stored) {
        setToken(stored);
        try {
          setPayload(jwtDecode<MyJwtPayload>(stored));
        } catch {
          setPayload(null);
        }
      }

      setHydrated(true);
    });
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setPayload(jwtDecode<MyJwtPayload>(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPayload(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId: payload?.userId ?? null,
        tenantId: payload?.tenantId ?? null,
        roles: payload?.roles ?? [],
        role: payload?.roles?.[0] ?? null,
        isAuthenticated: !!token,
        login,
        logout,
        hydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
