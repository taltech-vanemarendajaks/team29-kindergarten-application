import { API_URL } from "@/src/services/api";
import type { AnnouncementUserPage } from "../model/announcementTypes";

export async function getAnnouncements(
  token: string,
  page: number,
  size = 10
): Promise<AnnouncementUserPage> {
  const response = await fetch(
    `${API_URL}/api/v1/announcements/me?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load announcements");
  }

  return (await response.json()) as AnnouncementUserPage;
}