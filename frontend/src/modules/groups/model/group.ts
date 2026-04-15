export type GroupTeacherSummary = {
    id: number;
    fullName: string;
};

export type Group = {
    id: number;
    tenantId: number;
    name: string;
    ageRange: string | null;
    teacher: GroupTeacherSummary | null;
    createdAt: string;
    updatedAt: string;
};
