export interface DailyJournalEntryPayload {
    summary: string;
    milestones: string;
    photoUrls: string[];
}

export interface DailyJournalEntry {
    id: number;
    date: string;
    summary: string;
    milestones: string;
    photoUrls: string[];
    teacherId: number;
    groupId: number;
}
