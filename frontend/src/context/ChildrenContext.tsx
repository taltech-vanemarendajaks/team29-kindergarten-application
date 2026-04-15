"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { ApiRequestError, ChildDto, getChildren } from "@/src/services/children";

interface ChildrenContextType {
  children: ChildDto[];
  isLoading: boolean;
  error: string | null;
  refreshChildren: () => Promise<void>;
  upsertChild: (child: ChildDto) => void;
  clearChildren: () => void;
}

const ChildrenContext = createContext<ChildrenContextType | null>(null);

export function ChildrenProvider({ children }: { children: ReactNode }) {
  const { token, hydrated } = useAuth();
  const [childrenList, setChildrenList] = useState<ChildDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearChildren = useCallback(() => {
    setChildrenList([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const refreshChildren = useCallback(async () => {
    if (!token) {
      clearChildren();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const page = await getChildren(token);
      setChildrenList(page.content);
    } catch (requestError) {
      if (requestError instanceof ApiRequestError) {
        setError(requestError.message);
      } else {
        setError("Failed to load children from API. Please refresh the page and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearChildren, token]);

  const upsertChild = useCallback((child: ChildDto) => {
    setChildrenList((current) => {
      const existingIndex = current.findIndex((item) => item.id === child.id);
      if (existingIndex === -1) {
        return [child, ...current];
      }

      const next = [...current];
      next[existingIndex] = child;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      clearChildren();
      return;
    }

    void refreshChildren();
  }, [clearChildren, hydrated, refreshChildren, token]);

  const value = useMemo(
    () => ({
      children: childrenList,
      isLoading,
      error,
      refreshChildren,
      upsertChild,
      clearChildren,
    }),
    [childrenList, isLoading, error, refreshChildren, upsertChild, clearChildren]
  );

  return <ChildrenContext.Provider value={value}>{children}</ChildrenContext.Provider>;
}

export function useChildrenState() {
  const context = useContext(ChildrenContext);
  if (!context) {
    throw new Error("useChildrenState must be used within ChildrenProvider");
  }

  return context;
}
