import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { getAnnouncements } from "../api/getAnnouncements";

export const useMessages = (page: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["messages", page],
    queryFn: () => getAnnouncements(token!, page),
    enabled: !!token, // prevents call before auth ready
    placeholderData: keepPreviousData,
  });
};