import type { Child, UpdateChildPayload } from "../model/child";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import {API_URL} from "@/src/services/api";


export async function updateChild(token: string, id: number, payload: UpdateChildPayload): Promise<Child> {
    const response = await fetch(`${API_URL}/api/v1/children/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to update child profile");
    }

    return response.json();
}
