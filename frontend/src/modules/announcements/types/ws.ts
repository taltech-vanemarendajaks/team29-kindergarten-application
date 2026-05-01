export type WsEvent =
  | {
      type: "ANNOUNCEMENT_CREATED";
      payload: {
        id: number;
        title: string;
      };
    }
  | {
      type: "NEW_MESSAGE";
      payload: {
        messageId: number;
      };
    };  