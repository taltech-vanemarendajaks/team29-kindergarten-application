import { API_URL } from "@/src/shared/constants/api";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import type { Group } from "../model/group";

export async function getGroupById(groupId: number, token: string): Promise<Group> {
    const response = await fetch(`${API_URL}/api/v1/groups/${groupId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to load group"));
    }

    return (await response.json()) as Group;
}
