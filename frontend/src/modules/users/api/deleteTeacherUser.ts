import { parseApiError } from "@/src/shared/utils/parseApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteTeacherUser(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/users/teachers/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to delete teacher"));
    }
}
