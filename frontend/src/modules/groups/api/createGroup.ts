import type { Group } from "../model/group";
import type { UpdateGroupPayload } from "./updateGroup";
import { parseApiError } from "@/src/shared/utils/parseApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createGroup(
    token: string,
    payload: UpdateGroupPayload,
): Promise<Group> {
    const response = await fetch(`${API_URL}/api/v1/groups`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to create group"));
    }

    return response.json();
}
