// WebSocketInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { wsService } from "@/src/services/wsService";

export default function WebSocketInitializer() {
  const { token, tenantId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token || !tenantId) return;

    wsService.connect(token, tenantId);
  }, [isAuthenticated, token, tenantId]);

  return null;
}