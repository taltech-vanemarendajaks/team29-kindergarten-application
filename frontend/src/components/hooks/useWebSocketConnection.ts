"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/src/context/AuthContext";
import { WsEvent } from "@/src/modules/announcements/types/ws";

export function useWebSocketConnection(onMessage?: (msg: WsEvent) => void) {
  const { token, isAuthenticated, tenantId } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !token || !tenantId) return;

    // prevent duplicate clients
    if (clientRef.current) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");

        const destination = `/topic/tenant/${tenantId}/messages`;

        console.log("Subscribing to:", destination);

        // avoid duplicate subscription
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = client.subscribe(destination, (message) => {
          const parsed = JSON.parse(message.body);
          onMessage?.(parsed);
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
      clientRef.current = null;
    };
  }, [isAuthenticated, token, tenantId]);

  return clientRef;
}