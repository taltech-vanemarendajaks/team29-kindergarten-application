import { API_URL } from "@/src/shared/constants/api";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import type { Child } from "../model/child";

export type UpdateChildGroupPayload = {
    groupId: number | null;
};

export async function updateChildGroup(
    childId: number,
    token: string,
    payload: UpdateChildGroupPayload,
): Promise<Child> {
    const response = await fetch(`${API_URL}/api/v1/children/${childId}/group`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to update child group"));
    }

    return (await response.json()) as Child;
}
