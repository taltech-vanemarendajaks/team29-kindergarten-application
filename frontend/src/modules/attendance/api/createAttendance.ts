import { API_URL } from "@/src/services/api";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import type { AttendanceRecord, AttendanceStatus } from "../model/attendance";

export interface CreateAttendanceRequest {
    childId: number;
    date: string;
    status: AttendanceStatus;
}

export async function createAttendance(
    token: string,
    request: CreateAttendanceRequest
): Promise<AttendanceRecord> {
    const response = await fetch(`${API_URL}/api/v1/attendances`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to create attendance record");
    }

    return response.json();
}
