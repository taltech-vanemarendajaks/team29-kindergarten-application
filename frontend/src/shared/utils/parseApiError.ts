type ApiErrorResponse = {
    error?: string;
    message?: string;
    fieldErrors?: Record<string, string> | null;
};

export async function parseApiError(response: Response, fallbackMessage: string): Promise<string> {
    try {
        const data = (await response.json()) as ApiErrorResponse;

        const firstFieldError = data.fieldErrors ? Object.values(data.fieldErrors)[0] : undefined;

        return firstFieldError || data.message || data.error || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
}
