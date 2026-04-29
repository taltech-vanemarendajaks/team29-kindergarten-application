import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export const createWebSocketClient = (token: string) => {
  if (client && client.active) return client;

  client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000, // auto-reconnect
    debug: (str) => console.log(str),
  });

  return client;
};

export const getWebSocketClient = () => client;