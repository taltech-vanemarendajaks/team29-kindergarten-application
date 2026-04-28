"use client";

import { useEffect, useState } from "react";
import type { PageResponse } from "@/src/shared/model/page";
import { getGroups } from "../api/getGroups";
import { getGroupOptions } from "../api/getGroupOptions";
import type { Group } from "../model/group";

export function useGroups(
  token: string | null,
  page: number,
  size = 10,
  enabled = true,
  search = "",
) {
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
        const data = await getGroups(resolvedToken, page, size, search);

        if (!cancelled) {
          setGroupPage(data);
          setGroups(data.content);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load groups",
          );
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
  }, [enabled, page, reloadKey, search, size, token]);

  return {
    groups,
    groupPage,
    loading,
    error,
    setGroups,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}

export function useGroupOptions(token: string | null, enabled = true) {
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

    async function loadGroupOptions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getGroupOptions(resolvedToken);

        if (!cancelled) {
          setGroups(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load group options",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadGroupOptions();

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadKey, token]);

  return {
    groups,
    loading,
    error,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
