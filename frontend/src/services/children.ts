const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export interface CreateChildPayload {
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

function withQuery(path: string, query: Record<string, string | number | undefined>) {
    const search = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
            search.set(key, String(value));
        }
    });

    return `${path}?${search.toString()}`;
}

export async function createChild(
    payload: CreateChildPayload,
    token: string,
    tenantId: number,
    parentId: number
) {
    const response = await fetch(withQuery(`${API_URL}/api/v1/children`, { tenantId, parentId }), {
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

    return (await response.json()) as ChildDto;
}

export async function getChildren(
    token: string,
    tenantId: number,
    page = 0,
    size = 20
) {
    const response = await fetch(
        withQuery(`${API_URL}/api/v1/children`, { tenantId, page, size }),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch children");
    }

    return (await response.json()) as PageResponse<ChildDto>;
}

export async function getChildById(token: string, id: number, tenantId: number) {
    const response = await fetch(
        withQuery(`${API_URL}/api/v1/children/${id}`, { tenantId }),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch child profile");
    }

    return (await response.json()) as ChildDto;
}
