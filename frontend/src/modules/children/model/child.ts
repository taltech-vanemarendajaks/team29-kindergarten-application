export type ChildGroupSummary = {
    id: number;
    name: string;
};

export type ChildContactSummary = {
    id: number;
    fullName: string;
    email: string;
};

export type Child = {
    id: number;
    tenantId: number;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    group: ChildGroupSummary | null;
    contacts: ChildContactSummary[];
    createdAt: string;
    updatedAt: string;
};
