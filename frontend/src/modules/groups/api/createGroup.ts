import type { Group } from "../model/group";
import type { UpdateGroupPayload } from "./updateGroup";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createGroup(
    tenantId: number,
    token: string,
    payload: UpdateGroupPayload,
): Promise<Group> {
    const response = await fetch(`${API_URL}/api/v1/groups?tenantId=${tenantId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to create group");
    }

    return response.json();
}
