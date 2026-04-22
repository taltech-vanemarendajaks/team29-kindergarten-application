export type AttendanceStatus = "PRESENT" | "ABSENT" | "SICK";

export interface AttendanceRecord {
    id: number;
    tenantId: number;
    childId: number;
    date: string;
    status: AttendanceStatus;
    createdAt: string;
    updatedAt: string;
}
