"use client";

import { useEffect, useState } from "react";
import type { PageResponse } from "@/src/shared/model/page";
import { getChildren, getUnassignedChildren } from "../api/getChildren";
import type { Child } from "../model/child";

export function useChildren(token: string | null, page: number, size = 10, enabled = true) {
    const [childPage, setChildPage] = useState<PageResponse<Child> | null>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const resolvedToken = token;
        let cancelled = false;

        async function loadChildren() {
            try {
                setLoading(true);
                setError(null);
                const data = await getChildren(resolvedToken, page, size);

                if (!cancelled) {
                    setChildPage(data);
                    setChildren(data.content);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load children");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadChildren();

        return () => {
            cancelled = true;
        };
    }, [enabled, page, reloadKey, size, token]);

    return {
        childPage,
        children,
        loading,
        error,
        refetch: () => setReloadKey((currentValue) => currentValue + 1),
    };
}

export function useUnassignedChildren(token: string | null, page: number, size = 5, enabled = true) {
    const [childPage, setChildPage] = useState<PageResponse<Child> | null>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const resolvedToken = token;
        let cancelled = false;

        async function loadUnassignedChildren() {
            try {
                setLoading(true);
                setError(null);
                const data = await getUnassignedChildren(resolvedToken, page, size);

                if (!cancelled) {
                    setChildPage(data);
                    setChildren(data.content);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load unassigned children");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadUnassignedChildren();

        return () => {
            cancelled = true;
        };
    }, [enabled, page, reloadKey, size, token]);

    return {
        childPage,
        children,
        loading,
        error,
        refetch: () => setReloadKey((currentValue) => currentValue + 1),
    };
}
