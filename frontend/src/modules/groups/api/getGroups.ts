import type { Group } from "../model/group";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getGroups(tenantId: number, token: string): Promise<Group[]> {
    const response = await fetch(`${API_URL}/api/v1/groups?tenantId=${tenantId}`, {
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
