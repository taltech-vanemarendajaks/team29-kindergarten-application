export interface DailyJournalEntryPayload {
    summary: string;
    milestones: string;
    photoUrls: string[];
    date: string;
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
