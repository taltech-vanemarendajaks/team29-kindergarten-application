"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocketConnection } from "../../../components/hooks/useWebSocketConnection";
import { WsEvent } from "../types/ws";

export function useMessageUpdates(page: number) {
  const clientRef = useWebSocketConnection();
  const queryClient = useQueryClient();

  useEffect(() => {
    const client = clientRef.current;
    if (!client || !client.connected) return;

    const subscription = client.subscribe("/topic/messages", (message) => {
      const event: WsEvent = JSON.parse(message.body);

      if (event.type === "NEW_MESSAGE") {
        queryClient.invalidateQueries({ queryKey: ["messages", 1] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clientRef, queryClient, page]);
}