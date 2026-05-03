"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { wsService } from "@/src/services/wsService";

export default function WebSocketInitializer() {
  const { token, tenantId, isAuthenticated } = useAuth();

  useEffect(() => {
    // CONNECT
    if (isAuthenticated && token && tenantId) {
      wsService.connect(token, tenantId);
    } 
    //  DISCONNECT (logout / token missing)
    else {
      wsService.disconnect();
    }

    // Cleanup (important on unmount / re-run)
    return () => {
      wsService.disconnect();
    };
  }, [isAuthenticated, token, tenantId]);

  return null;
}