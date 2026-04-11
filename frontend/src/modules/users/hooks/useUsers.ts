"use client";

import { useEffect, useState } from "react";
import type { PageResponse } from "@/src/shared/model/page";
import { getUserOptionsByRole, getUsersByRole } from "../api/getUsers";
import type { User } from "../model/user";

export function useUsersByRole(
    token: string | null,
    role: string,
    page: number,
    size = 10,
    enabled = true,
) {
    const [userPage, setUserPage] = useState<PageResponse<User> | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const resolvedToken = token;
        let cancelled = false;

        async function loadUsers() {
            try {
                setLoading(true);
                setError(null);
                const data = await getUsersByRole(resolvedToken, role, page, size);

                if (!cancelled) {
                    setUserPage(data);
                    setUsers(data.content);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load users");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadUsers();

        return () => {
            cancelled = true;
        };
    }, [enabled, page, reloadKey, role, size, token]);

    return {
        users,
        userPage,
        loading,
        error,
        setUsers,
        refetch: () => setReloadKey((currentValue) => currentValue + 1),
    };
}

export function useUserOptionsByRole(token: string | null, role: string, enabled = true) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const resolvedToken = token;
        let cancelled = false;

        async function loadUserOptions() {
            try {
                setLoading(true);
                setError(null);
                const data = await getUserOptionsByRole(resolvedToken, role);

                if (!cancelled) {
                    setUsers(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load users");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadUserOptions();

        return () => {
            cancelled = true;
        };
    }, [enabled, reloadKey, role, token]);

    return {
        users,
        loading,
        error,
        setUsers,
        refetch: () => setReloadKey((currentValue) => currentValue + 1),
    };
}
