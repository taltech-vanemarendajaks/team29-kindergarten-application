import {API_URL, handleApiError} from "@/src/services/api";

export async function getParentJournalEntries(token: string) {
    const response = await fetch(`${API_URL}/api/parent/journal`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    return response.json();
}