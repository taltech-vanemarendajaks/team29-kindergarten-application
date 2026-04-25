"use client";

import { useEffect, useState } from "react";
import { useUsersByRole } from "@/src/modules/users";
import { API_URL } from "@/src/services/api";
import { parseApiError } from "@/src/shared/utils/parseApiError";
import type { User } from "@/src/modules/users";

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

export function useAvailableTeacherOptions(token: string | null, groupId?: number | null, enabled = true) {
    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const resolvedToken = token;
        let cancelled = false;

        async function loadAssignableTeachers() {
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams();
                if (groupId != null) {
                    params.set("groupId", String(groupId));
                }

                const response = await fetch(
                    `${API_URL}/api/v1/users/teachers/available-options${params.size ? `?${params.toString()}` : ""}`,
                    {
                        headers: {
                            Authorization: `Bearer ${resolvedToken}`,
                        },
                        cache: "no-store",
                    },
                );

                if (!response.ok) {
                    throw new Error(await parseApiError(response, "Failed to fetch assignable teachers"));
                }

                const data = (await response.json()) as User[];

                if (!cancelled) {
                    setTeachers(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to fetch assignable teachers");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadAssignableTeachers();

        return () => {
            cancelled = true;
        };
    }, [enabled, groupId, reloadKey, token]);

    return {
        teachers,
        loading,
        error,
        refetch: () => setReloadKey((currentValue) => currentValue + 1),
    };
}
