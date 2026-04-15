"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/src/context/AuthContext";
import { ChildrenProvider } from "@/src/context/ChildrenContext";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChildrenProvider>{children}</ChildrenProvider>
    </AuthProvider>
  );
}
