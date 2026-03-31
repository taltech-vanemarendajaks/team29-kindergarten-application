"use client";

import {createContext, useContext, useEffect, useState} from "react";
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Load token once, without useEffect
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }

    return null;
  });

  const [payload, setPayload] = useState<MyJwtPayload | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      if (stored) {
        try {
          return jwtDecode<MyJwtPayload>(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

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