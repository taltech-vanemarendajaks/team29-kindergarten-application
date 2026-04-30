import { API_URL } from "@/src/services/api";
import type { PageResponse } from "@/src/shared/model/page";
import type { User } from "../model/user";

export async function getUsersByRole(
  token: string,
  role: string,
  page: number,
  size = 10,
  search?: string,
  sortField = "fullName",
  sortDirection = "asc",
): Promise<PageResponse<User>> {
  const params = new URLSearchParams({
    role,
    page: String(page),
    size: String(size),
    sort: `${sortField},${sortDirection}`,
  });
  if (search && search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(`${API_URL}/api/v1/users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUserOptionsByRole(
  token: string,
  role: string,
): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/v1/users/options?role=${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
