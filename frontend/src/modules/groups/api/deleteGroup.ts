import { parseApiError } from "@/src/shared/utils/parseApiError";
import { API_URL } from "@/src/services/api";

export async function deleteGroup(groupId: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/groups/${groupId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to delete group"));
    }
}
