import type { User } from "../model/user";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import { API_URL } from "@/src/services/api";

export type UpdateTeacherUserPayload = {
    fullName: string;
    email: string;
    password?: string;
};

export async function updateTeacherUser(
    id: number,
    token: string,
    payload: UpdateTeacherUserPayload,
): Promise<User> {
    const response = await fetch(`${API_URL}/api/v1/users/teachers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to update teacher"));
    }

    return response.json();
}
