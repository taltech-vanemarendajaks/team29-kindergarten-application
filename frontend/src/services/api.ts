import toast from "react-hot-toast";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function handleApiError(response: Response) {
    let message = `HTTP ${response.status}`;
    const body = await response.text();

    try {
        const data = JSON.parse(body);
        message = data.message || JSON.stringify(data);
    } catch {
        if (body) message = body;
    }

    toast.error(message);
    throw new Error(message);
}
