import type { Teacher } from "../model/teacher";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTeachers(tenantId: number, token: string): Promise<Teacher[]> {
    const response = await fetch(`${API_URL}/api/v1/teachers?tenantId=${tenantId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch teachers");
    }

    return response.json();
}
