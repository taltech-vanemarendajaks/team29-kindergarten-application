const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export interface CreateChildPayload {
    firstName: string;
    lastName: string;
    birthDate: string;
    groupId?: number;
}

export interface UpdateChildPayload {
    firstName: string;
    lastName: string;
    birthDate: string;
    groupId?: number;
}

export interface ChildDto {
    id: number;
    tenantId: number;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    groupId: number | null;
    groupName: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface ApiErrorResponse {
    message?: string;
}

export class ApiRequestError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
    }
}

function withQuery(path: string, query: Record<string, string | number | undefined>) {
    const search = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
            search.set(key, String(value));
        }
    });

    return `${path}?${search.toString()}`;
}

async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
    let message = fallbackMessage;

    try {
        const payload = (await response.json()) as ApiErrorResponse;
        if (payload?.message && payload.message.trim().length > 0) {
            message = payload.message;
        }
    } catch {
        // ignore JSON parse errors and keep fallback message
    }

    throw new ApiRequestError(message, response.status);
}

export async function createChild(
    payload: CreateChildPayload,
    token: string
) {
    const response = await fetch(`${API_URL}/api/v1/children`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to create child");
    }

    return (await response.json()) as ChildDto;
}

export async function getChildren(token: string, page = 0, size = 20) {
    const response = await fetch(withQuery(`${API_URL}/api/v1/children`, { page, size }), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to fetch children");
    }

    return (await response.json()) as PageResponse<ChildDto>;
}

export async function getChildById(token: string, id: number) {
    const response = await fetch(`${API_URL}/api/v1/children/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to fetch child profile");
    }

    return (await response.json()) as ChildDto;
}

export async function updateChild(
    token: string,
    id: number,
    payload: UpdateChildPayload
) {
    const response = await fetch(`${API_URL}/api/v1/children/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to update child profile");
    }

    return (await response.json()) as ChildDto;
}
