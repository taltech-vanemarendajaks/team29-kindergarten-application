import type { Child } from "../model/child";
import type { PageResponse } from "@/src/shared/model/page";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import { API_URL } from "@/src/shared/constants/api";

export async function getChildren(token: string, page = 0, size = 20): Promise<PageResponse<Child>> {
    const response = await fetch(`${API_URL}/api/v1/children?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to fetch children");
    }

    return response.json();
}
