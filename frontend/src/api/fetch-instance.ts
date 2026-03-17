export const fetchInstance = async <T>(
    url: string,
    options?: RequestInit,
): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const data = await response.json();

    return {
        data,
        status: response.status,
        headers: response.headers,
    } as T;
};