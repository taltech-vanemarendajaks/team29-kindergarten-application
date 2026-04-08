const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export interface CreateChildPayload {
    firstName: string;
    lastName: string;
    birthDate: string;
}

export async function createChild(payload: CreateChildPayload, token: string) {
    const response = await fetch(`${API_URL}/children`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to create child");
    }

    return response.json();
}
