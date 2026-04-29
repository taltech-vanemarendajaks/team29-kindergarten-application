import { parseApiError } from "@/src/shared/utils/parseApiError";
import { API_URL } from "@/src/services/api";
import {DailyJournalEntry, DailyJournalEntryPayload} from "@/src/modules/teachers/model/dailyJournalEntry";

export async function callDailyJournalEntry(
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

export async function getDailyJournalEntry(token: string, id: number): Promise<DailyJournalEntry> {
    const response = await fetch(`${API_URL}/api/teacher/journal/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to load journal entry"));
    }

    return response.json();
}

export async function getTeacherJournalEntries(token: string) {
    const res = await fetch(`${API_URL}/api/teacher/journal`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to load journal entries");
    }

    return res.json();
}

export async function updateDailyJournalEntry(token: string, id: number, data: any): Promise<DailyJournalEntry> {
    const res = await fetch(`${API_URL}/api/teacher/journal/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update entry");
    }
    return res.json();
}

