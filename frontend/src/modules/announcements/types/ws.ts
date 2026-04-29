export type WsEvent =
  | { type: "NEW_MESSAGE"; messageId: number }
  | { type: "MESSAGE_DELETED"; messageId: number }
  | { type: "TYPING"; userId: number };