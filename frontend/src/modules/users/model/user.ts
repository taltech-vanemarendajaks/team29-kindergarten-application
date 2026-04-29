export type User = {
    id: number;
    tenantId: number;
    fullName: string;
    email: string;
    assignedGroupName?: string | null;
};
