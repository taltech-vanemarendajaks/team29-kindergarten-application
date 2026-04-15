"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/src/context/AuthContext";
import { KindergartenProvider } from "@/src/context/KindergartenContext";
import { GroupsProvider } from "@/src/context/GroupsContext";
import { ChildrenProvider } from "@/src/context/ChildrenContext";
import { ParentsProvider } from "@/src/context/ParentsContext";
import { TeachersProvider } from "@/src/context/TeachersContext";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <KindergartenProvider>
        <GroupsProvider>
          <TeachersProvider>
            <ParentsProvider>
              <ChildrenProvider>{children}</ChildrenProvider>
            </ParentsProvider>
          </TeachersProvider>
        </GroupsProvider>
      </KindergartenProvider>
    </AuthProvider>
  );
}
