import type { Child, CreateChildPayload } from "../model/child";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import { API_URL } from "@/src/shared/constants/api";

export async function createChild(token: string, payload: CreateChildPayload): Promise<Child> {
    const response = await fetch(`${API_URL}/api/v1/children`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to create child");
    }

    return response.json();
}
