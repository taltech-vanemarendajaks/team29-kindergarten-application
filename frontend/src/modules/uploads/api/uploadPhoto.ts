import {API_URL} from "@/src/services/api";

export async function uploadPhoto(file: File, token: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload/photo`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to upload photo");
    }

    return res.text();
}
