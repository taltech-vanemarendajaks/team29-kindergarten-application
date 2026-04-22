import { API_URL } from "@/src/shared/constants/api";
import type { PageResponse } from "@/src/shared/model/page";
import type { Child } from "../model/child";

export async function getChildren(token: string, page: number, size = 10): Promise<PageResponse<Child>> {
    const response = await fetch(`${API_URL}/api/v1/children?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to load children");
    }

    return (await response.json()) as PageResponse<Child>;
}

export async function getUnassignedChildren(
    token: string,
    page: number,
    size = 5,
): Promise<PageResponse<Child>> {
    const response = await fetch(`${API_URL}/api/v1/children/unassigned?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to load unassigned children");
    }

    return (await response.json()) as PageResponse<Child>;
}
