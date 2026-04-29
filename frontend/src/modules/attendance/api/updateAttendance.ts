import { API_URL } from "@/src/services/api";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import type { AttendanceRecord, AttendanceStatus } from "../model/attendance";

export interface UpdateAttendanceRequest {
    childId: number;
    date: string;
    status: AttendanceStatus;
}

export async function updateAttendance(
    token: string,
    attendanceId: number,
    request: UpdateAttendanceRequest
): Promise<AttendanceRecord> {
    const response = await fetch(`${API_URL}/api/v1/attendances/${attendanceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to update attendance record");
    }

    return response.json();
}
