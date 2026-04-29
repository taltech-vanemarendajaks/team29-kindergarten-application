import { API_URL } from "@/src/services/api";
import type { PageResponse } from "@/src/shared/model/page";
import type { User } from "../model/user";

export async function getUsersByRole(
    token: string,
    role: string,
    page: number,
    size = 10,
): Promise<PageResponse<User>> {
    const response = await fetch(`${API_URL}/api/v1/users?role=${role}&page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}

export async function getUserOptionsByRole(token: string, role: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/v1/users/options?role=${role}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}
