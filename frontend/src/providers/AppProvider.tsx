"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/src/context/AuthContext";
import { KindergartenProvider } from "@/src/context/KindergartenContext";
import { GroupsProvider } from "@/src/context/GroupsContext";
import { ChildrenProvider } from "@/src/context/ChildrenContext";
import { ParentsProvider } from "@/src/context/ParentsContext";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <KindergartenProvider>
        <GroupsProvider>
          <ParentsProvider>
            <ChildrenProvider>{children}</ChildrenProvider>
          </ParentsProvider>
        </GroupsProvider>
      </KindergartenProvider>
    </AuthProvider>
  );
}
