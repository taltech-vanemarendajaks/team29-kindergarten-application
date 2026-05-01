"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/src/context/AuthContext";
import { KindergartenProvider } from "@/src/context/KindergartenContext";
import { GroupsProvider } from "@/src/context/GroupsContext";
import { ChildrenProvider } from "@/src/context/ChildrenContext";
import { ParentsProvider } from "@/src/context/ParentsContext";
import WebSocketInitializer from "@/src/components/WebSocketInitializer";

export default function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketInitializer />

        <KindergartenProvider>
          <GroupsProvider>
            <ParentsProvider>
              <ChildrenProvider>{children}</ChildrenProvider>
            </ParentsProvider>
          </GroupsProvider>
        </KindergartenProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}