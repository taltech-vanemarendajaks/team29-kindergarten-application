"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/src/context/AuthContext";

export function useWebSocketConnection() {
  const { token, isAuthenticated } = useAuth();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    if (clientRef.current?.active) return; // ✅ prevent duplicates

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log("✅ WebSocket connected");
    };

    client.onStompError = (frame) => {
    console.error("❌ Broker error:", frame.headers["message"]);
    };

    client.onWebSocketError = (err) => {
      console.error("❌ WS error:", err);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, isAuthenticated]);

  return clientRef;
}