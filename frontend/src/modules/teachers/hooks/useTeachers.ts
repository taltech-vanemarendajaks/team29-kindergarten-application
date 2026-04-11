"use client";

import { useUserOptionsByRole, useUsersByRole } from "@/src/modules/users";

export function useTeachers(token: string | null, page: number, size = 10, enabled = true) {
    const {
        users: teachers,
        userPage: teacherPage,
        loading,
        error,
        refetch,
    } = useUsersByRole(
        token,
        "TEACHER",
        page,
        size,
        enabled,
    );

    return { teachers, teacherPage, loading, error, refetch };
}

export function useTeacherOptions(token: string | null, enabled = true) {
    const { users: teachers, loading, error, refetch } = useUserOptionsByRole(
        token,
        "TEACHER",
        enabled,
    );

    return { teachers, loading, error, refetch };
}
