import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export function getStompClient(token: string) {
  if (!client) {
    client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
    });
  }

  return client;
}