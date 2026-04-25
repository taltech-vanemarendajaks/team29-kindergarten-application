export type Child = {
    id: number;
    tenantId: number;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    groupId: number | null;
    groupName: string | null;
    createdAt: string;
    updatedAt: string;
};

export type CreateChildPayload = {
    firstName: string;
    lastName: string;
    birthDate: string;
    groupId?: number;
};

export type UpdateChildPayload = {
    firstName: string;
    lastName: string;
    birthDate: string;
    groupId?: number;
};
