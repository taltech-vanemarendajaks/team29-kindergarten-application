import { Client, StompSubscription } from "@stomp/stompjs";
import { getWsUrl } from "./getWsUrl";
import { WsEvent } from "@/src/modules/announcements/types/ws";

type Listener = (msg: WsEvent) => void;

class WsService {
  private client: Client | null = null;
  private listeners: Listener[] = [];
  private subscription: StompSubscription | null = null;
  private isConnecting = false;

  private currentToken: string | null = null;
  private currentTenantId: number | null = null;

  connect(token: string, tenantId: number) {
  if (this.client || this.isConnecting) {
    console.log("WS already connecting/connected");
    return;
  }

  this.isConnecting = true;

  this.currentToken = token;
  this.currentTenantId = tenantId;

  this.client = new Client({
    brokerURL: getWsUrl(),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      console.log("WS connected");

      this.isConnecting = false;

      this.subscription = this.client?.subscribe(
        `/topic/tenant/${tenantId}/messages`,
        (message) => {
          try {
            const parsed = JSON.parse(message.body);
            this.listeners.forEach((l) => l(parsed));
          } catch (e) {
            console.error("WS parse error", e);
          }
        }
      ) || null;
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    },

    onWebSocketClose: () => {
      console.log("WS closed");

      this.client = null;
      this.isConnecting = false;
    },

    debug: (msg) => console.log("STOMP:", msg),

    reconnectDelay: 0, // for debugging
  });

  this.client.activate();
}

  disconnect() {
  console.log("Disconnecting WS...");

  if (this.subscription) {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  if (this.client) {
    this.client.deactivate();
    this.client = null;
  }

  this.isConnecting = false;
}

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}


export const wsService = new WsService();