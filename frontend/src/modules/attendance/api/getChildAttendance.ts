import { API_URL } from "@/src/shared/constants/api";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";
import type { AttendanceRecord } from "../model/attendance";

export interface GetChildAttendanceParams {
    childId: number;
    from: string;
    to: string;
}

export async function getChildAttendance(
    token: string,
    params: GetChildAttendanceParams
): Promise<AttendanceRecord[]> {
    const search = new URLSearchParams({
        childId: String(params.childId),
        from: params.from,
        to: params.to,
    });

    const response = await fetch(`${API_URL}/api/v1/attendances?${search.toString()}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to fetch attendance");
    }

    return response.json();
}
