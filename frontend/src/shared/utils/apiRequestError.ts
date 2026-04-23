import { parseApiError } from "./parseApiError";

export class ApiRequestError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
    }
}

export async function throwApiRequestError(response: Response, fallbackMessage: string): Promise<never> {
    const message = await parseApiError(response, fallbackMessage);
    throw new ApiRequestError(message, response.status);
}
