"use client";

import { useEffect, useState } from "react";
import { getGroups } from "../api/getGroups";
import type { Group } from "../model/group";

export function useGroups(tenantId: number | null, token: string | null, enabled = true) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = async () => {
        if (!enabled || !tenantId || !token) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getGroups(tenantId, token);
            setGroups(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load groups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled || !tenantId || !token) {
            return;
        }
        const resolvedToken = token;
        const resolvedTenantId = tenantId;

        let cancelled = false;

        async function loadGroups() {
            try {
                setLoading(true);
                setError(null);
                const data = await getGroups(resolvedTenantId, resolvedToken);

                if (!cancelled) {
                    setGroups(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load groups");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadGroups();

        return () => {
            cancelled = true;
        };
    }, [enabled, tenantId, token]);

    return { groups, loading, error, setGroups, refetch };
}
