import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { MessagePage } from "../types/messageTypes";

export const useMessages = (page: number) => {
  return useQuery<MessagePage>({
    queryKey: ["messages", page],
    queryFn: async () => {
      const res = await fetch(`/api/messages?page=${page}`);
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
};