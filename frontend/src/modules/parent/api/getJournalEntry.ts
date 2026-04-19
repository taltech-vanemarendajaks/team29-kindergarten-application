import {API_URL, handleApiError} from "@/src/services/api";
import {DailyJournalEntry} from "@/src/modules/teachers/model/dailyJournalEntry";

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

export async function getParentJournalEntryById(token: string, id: number): Promise<DailyJournalEntry> {
    const res = await fetch(`${API_URL}/api/parent/journal/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to load journal entry");
    }

    return res.json();
}