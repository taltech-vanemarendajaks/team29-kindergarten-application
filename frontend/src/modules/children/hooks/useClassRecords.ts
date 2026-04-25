"use client";

import { useEffect, useState } from "react";
import { getClassRecords } from "../api/getClassRecords";
import type { Child } from "../model/child";

export function useClassRecords(token: string | null, enabled = true) {
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

    async function loadClassRecords() {
      try {
        setLoading(true);
        setError(null);
        const data = await getClassRecords(resolvedToken);

        if (!cancelled) {
          setChildren(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load class records",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadClassRecords();

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadKey, token]);

  return {
    children,
    loading,
    error,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
