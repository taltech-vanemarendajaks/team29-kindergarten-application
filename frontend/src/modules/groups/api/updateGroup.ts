import type { Group } from "../model/group";

export type UpdateGroupPayload = {
    name: string;
    ageRange: string | null;
    teacherId: number | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        throw new Error("Failed to update group");
    }

    return response.json();
}
