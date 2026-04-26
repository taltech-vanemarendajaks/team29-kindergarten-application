import { API_URL } from "@/src/services/api";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import type { Child } from "../model/child";

export type UpdateChildPayload = {
    firstName: string;
    lastName: string;
    birthDate: string | null;
    groupId: number | null;
};

export async function updateChild(
    childId: number,
    token: string,
    payload: UpdateChildPayload,
): Promise<Child> {
    const response = await fetch(`${API_URL}/api/v1/children/${childId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to update child"));
    }

    return (await response.json()) as Child;
}
