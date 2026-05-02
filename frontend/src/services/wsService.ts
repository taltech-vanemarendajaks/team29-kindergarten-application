import { Client } from "@stomp/stompjs";
import { getWsUrl } from "./getWsUrl";

// src/services/wsService.ts
type Listener = (msg: any) => void;

class WsService {
  private client: Client | null = null;
  private listeners: Listener[] = [];

  connect(token: string, tenantId: number) {
    if (this.client?.active) return; // ✅ prevent duplicates

    this.client = new Client({
      brokerURL: getWsUrl(),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("WS connected");

        this.client?.subscribe(
          `/topic/tenant/${tenantId}/messages`,
          (message) => {
            const parsed = JSON.parse(message.body);
            this.listeners.forEach((l) => l(parsed));
          }
        );
      },

      reconnectDelay: 5000,
    });

    this.client.activate();
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const wsService = new WsService();