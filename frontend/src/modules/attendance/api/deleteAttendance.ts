import { API_URL } from "@/src/services/api";
import { throwApiRequestError } from "@/src/shared/utils/apiRequestError";

export async function deleteAttendance(token: string, attendanceId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/attendances/${attendanceId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await throwApiRequestError(response, "Failed to reset attendance record");
    }
}
