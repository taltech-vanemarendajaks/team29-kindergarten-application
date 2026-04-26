export type ChildGroupSummary = {
    id: number;
    name: string;
};

export type ParentSummary = {
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
    parents: ParentSummary[];
    createdAt: string;
    updatedAt: string;
};
