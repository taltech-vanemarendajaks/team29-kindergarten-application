import type { Child } from "../model/child";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import { API_URL } from "@/src/shared/constants/api";

export async function getChildById(token: string, id: number): Promise<Child> {
    const response = await fetch(`${API_URL}/api/v1/children/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to fetch child profile");
    }

    return response.json();
}
