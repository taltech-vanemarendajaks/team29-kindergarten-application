import type { User } from "../model/user";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import { API_URL } from "@/src/services/api";

export type CreateTeacherUserPayload = {
    fullName: string;
    email: string;
    password: string;
};

export async function createTeacherUser(token: string, payload: CreateTeacherUserPayload): Promise<User> {
    const response = await fetch(`${API_URL}/api/v1/users/teachers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to create teacher"));
    }

    return response.json();
}
