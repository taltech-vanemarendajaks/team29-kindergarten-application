"use client";

import { useEffect, useState } from "react";
import { getTeachers } from "../api/getTeachers";
import type { Teacher } from "../model/teacher";

export function useTeachers(token: string | null, enabled = true) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const resolvedToken = token;
        let cancelled = false;

        async function loadTeachers() {
            try {
                setLoading(true);
                setError(null);
                const data = await getTeachers(resolvedToken);

                if (!cancelled) {
                    setTeachers(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load teachers");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadTeachers();

        return () => {
            cancelled = true;
        };
    }, [enabled, token]);

    return { teachers, loading, error, setTeachers };
}
