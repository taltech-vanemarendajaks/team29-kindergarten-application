import type { Child } from "../model/child";
import {API_URL} from "@/src/services/api";

export async function getClassRecords(token: string): Promise<Child[]> {
  const response = await fetch(`${API_URL}/api/v1/children/class-records`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch class records");
  }

  return response.json();
}
