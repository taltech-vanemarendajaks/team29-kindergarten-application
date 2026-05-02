import { Client } from "@stomp/stompjs";
import { getWsUrl } from "./getWsUrl";

let client: Client | null = null;

export function getStompClient(token: string) {
  if (!client) {
    client = new Client({
      brokerURL: getWsUrl(),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
    });
  }

  return client;
}