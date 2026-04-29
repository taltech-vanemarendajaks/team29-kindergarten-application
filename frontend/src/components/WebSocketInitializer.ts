"use client";

import { useWebSocketConnection } from "@/src/components/hooks/useWebSocketConnection";

export default function WebSocketInitializer() {
  useWebSocketConnection();
  return null; // no UI
}