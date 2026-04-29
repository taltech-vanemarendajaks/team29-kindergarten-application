"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export interface GroupState {
  id: number;
  name: string;
  teacherUserId: number | null;
}

interface GroupsContextType {
  groups: GroupState[];
  setGroups: (value: GroupState[]) => void;
  clearGroups: () => void;
}

const GroupsContext = createContext<GroupsContextType | null>(null);

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroupsState] = useState<GroupState[]>([]);

  const setGroups = useCallback((value: GroupState[]) => {
    setGroupsState(value);
  }, []);

  const clearGroups = useCallback(() => {
    setGroupsState([]);
  }, []);

  const value = useMemo(
    () => ({
      groups,
      setGroups,
      clearGroups,
    }),
    [groups, setGroups, clearGroups]
  );

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export function useGroupsState() {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroupsState must be used within GroupsProvider");
  }

  return context;
}
