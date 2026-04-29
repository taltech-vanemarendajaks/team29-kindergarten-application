import type { Group } from "../model/group";
import type { PageResponse } from "@/src/shared/model/page";
import { API_URL } from "@/src/services/api";

export async function getGroups(token: string, page: number, size = 10): Promise<PageResponse<Group>> {
    const response = await fetch(`${API_URL}/api/v1/groups?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }

    return response.json();
}
