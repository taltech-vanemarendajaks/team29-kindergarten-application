import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { wsService } from "@/src/services/wsService";
import { WsEvent } from "@/src/modules/announcements/types/ws";

export function useMessageUpdates(page: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg: WsEvent) => {
      if (msg.type === "ANNOUNCEMENT_CREATED") {
      queryClient.invalidateQueries({
        queryKey: ["messages", page],
      });
      }
    });

    return unsubscribe;
  }, [queryClient, page]);
}