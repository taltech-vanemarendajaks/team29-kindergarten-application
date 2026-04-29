import type { AttendanceRecord } from "../model/attendance";

export interface AttendanceSummary {
    presentDays: number;
    absentDays: number;
    sickDays: number;
    trackedDays: number;
    totalDaysInMonth: number;
    presenceRate: number;
}

export function summarizeAttendance(records: AttendanceRecord[], totalDaysInMonth: number): AttendanceSummary {
    const presentDays = records.filter((record) => record.status === "PRESENT").length;
    const absentDays = records.filter((record) => record.status === "ABSENT").length;
    const sickDays = records.filter((record) => record.status === "SICK").length;
    const trackedDays = presentDays + absentDays + sickDays;
    const presenceRate = trackedDays === 0 ? 0 : Math.round((presentDays / trackedDays) * 100);

    return {
        presentDays,
        absentDays,
        sickDays,
        trackedDays,
        totalDaysInMonth,
        presenceRate,
    };
}
