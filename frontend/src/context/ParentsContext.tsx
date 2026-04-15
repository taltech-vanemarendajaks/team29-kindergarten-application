"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export interface ParentState {
  id: number;
  fullName: string;
  email: string;
}

interface ParentsContextType {
  parents: ParentState[];
  setParents: (value: ParentState[]) => void;
  clearParents: () => void;
}

const ParentsContext = createContext<ParentsContextType | null>(null);

export function ParentsProvider({ children }: { children: ReactNode }) {
  const [parents, setParentsState] = useState<ParentState[]>([]);

  const setParents = useCallback((value: ParentState[]) => {
    setParentsState(value);
  }, []);

  const clearParents = useCallback(() => {
    setParentsState([]);
  }, []);

  const value = useMemo(
    () => ({
      parents,
      setParents,
      clearParents,
    }),
    [parents, setParents, clearParents]
  );

  return <ParentsContext.Provider value={value}>{children}</ParentsContext.Provider>;
}

export function useParentsState() {
  const context = useContext(ParentsContext);
  if (!context) {
    throw new Error("useParentsState must be used within ParentsProvider");
  }

  return context;
}
