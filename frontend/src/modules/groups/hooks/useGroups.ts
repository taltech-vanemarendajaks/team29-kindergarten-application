"use client";

import { useEffect, useState } from "react";
import type { PageResponse } from "@/src/shared/model/page";
import { getGroups } from "../api/getGroups";
import type { Group } from "../model/group";

export function useGroups(token: string | null, page: number, size = 10, enabled = true) {
    const [groupPage, setGroupPage] = useState<PageResponse<Group> | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }
        const resolvedToken = token;

        let cancelled = false;

        async function loadGroups() {
            try {
                setLoading(true);
                setError(null);
                const data = await getGroups(resolvedToken, page, size);

                if (!cancelled) {
                    setGroupPage(data);
                    setGroups(data.content);
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
    }, [enabled, page, reloadKey, size, token]);

    return {
        groups,
        groupPage,
        loading,
        error,
        setGroups,
        refetch: () => setReloadKey((currentValue) => currentValue + 1),
    };
}
