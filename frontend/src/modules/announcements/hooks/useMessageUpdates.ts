import { useWebSocketConnection } from "@/src/components/hooks/useWebSocketConnection";
import { useQueryClient } from "@tanstack/react-query";


export function useMessageUpdates(page: number) {
  const queryClient = useQueryClient();

  useWebSocketConnection(() => {
queryClient.invalidateQueries({
  queryKey: ["messages"],
  exact: false, // important
});
    });
  }