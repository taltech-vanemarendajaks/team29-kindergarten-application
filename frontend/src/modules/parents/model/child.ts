import type { Child } from "@/src/modules/children";

export type { Child };

export type CreateChildPayload = {
    firstName: string;
    lastName: string;
    birthDate: string;
    groupId?: number;
};

export type UpdateChildPayload = {
    firstName: string;
    lastName: string;
    birthDate: string | null;
    groupId?: number;
};
