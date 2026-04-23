"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export interface KindergartenState {
  id: number;
  name: string;
}

interface KindergartenContextType {
  kindergarten: KindergartenState | null;
  setKindergarten: (value: KindergartenState | null) => void;
  clearKindergarten: () => void;
}

const KindergartenContext = createContext<KindergartenContextType | null>(null);

export function KindergartenProvider({ children }: { children: ReactNode }) {
  const [kindergarten, setKindergartenState] = useState<KindergartenState | null>(null);

  const setKindergarten = useCallback((value: KindergartenState | null) => {
    setKindergartenState(value);
  }, []);

  const clearKindergarten = useCallback(() => {
    setKindergartenState(null);
  }, []);

  const value = useMemo(
    () => ({
      kindergarten,
      setKindergarten,
      clearKindergarten,
    }),
    [kindergarten, setKindergarten, clearKindergarten]
  );

  return <KindergartenContext.Provider value={value}>{children}</KindergartenContext.Provider>;
}

export function useKindergartenState() {
  const context = useContext(KindergartenContext);
  if (!context) {
    throw new Error("useKindergartenState must be used within KindergartenProvider");
  }

  return context;
}
