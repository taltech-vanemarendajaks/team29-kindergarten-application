import { API_URL } from "@/src/services/api";
import type { Group } from "../model/group";

export async function getGroupOptions(token: string): Promise<Group[]> {
    const response = await fetch(`${API_URL}/api/v1/groups/options`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch group options");
    }

    return response.json();
}
