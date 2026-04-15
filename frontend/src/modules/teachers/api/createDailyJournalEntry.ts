import { parseApiError } from "@/src/shared/utils/parseApiError";
import { API_URL } from "@/src/services/api";
import {DailyJournalEntry, DailyJournalEntryPayload} from "@/src/modules/teachers/model/dailyJournalEntry";

export async function createDailyJournalEntry(
    token: string,
    payload: DailyJournalEntryPayload,
): Promise<DailyJournalEntry> {
    const response = await fetch(`${API_URL}/api/teacher/journal`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to create daily journal entry"));
    }

    return response.json();
}
