"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/src/context/AuthContext";
import { WsEvent } from "@/src/modules/announcements/types/ws";

export function useWebSocketConnection(
  onMessage?: (msg: WsEvent) => void
) {
  const { token, isAuthenticated, tenantId } = useAuth();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token || !tenantId) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("WebSocket connected");

        const destination = `/topic/tenant/${tenantId}/messages`;
        console.log("Subscribing to:", destination);

        client.subscribe(destination, (message) => {
          const parsed = JSON.parse(message.body);
          onMessage?.(parsed);
        });
      },

      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, isAuthenticated, tenantId, onMessage]);

  return clientRef;
}