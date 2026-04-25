import type { Group } from "../model/group";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import { API_URL } from "@/src/services/api";

export type UpdateGroupPayload = {
    name: string;
    ageRange: string | null;
    teacherId: number | null;
};

export async function updateGroup(
    groupId: number,
    token: string,
    payload: UpdateGroupPayload,
): Promise<Group> {
    const response = await fetch(`${API_URL}/api/v1/groups/${groupId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to update group"));
    }

    return response.json();
}
