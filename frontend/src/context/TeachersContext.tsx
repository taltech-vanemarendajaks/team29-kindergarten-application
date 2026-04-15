"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getUsersByRole } from "@/src/modules/users/api/getUsers";
import type { User } from "@/src/modules/users/model/user";
import type { PageResponse } from "@/src/shared/model/page";

interface TeachersContextType {
  teachers: User[];
  teacherPage: PageResponse<User> | null;
  isLoading: boolean;
  error: string | null;
  refreshTeachers: () => Promise<void>;
  clearTeachers: () => void;
}

const TeachersContext = createContext<TeachersContextType | null>(null);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const { token, hydrated } = useAuth();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [teacherPage, setTeacherPage] = useState<PageResponse<User> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearTeachers = useCallback(() => {
    setTeachers([]);
    setTeacherPage(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const refreshTeachers = useCallback(async () => {
    if (!token) {
      clearTeachers();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const page = await getUsersByRole(token, "TEACHER", 0, 20);
      setTeacherPage(page);
      setTeachers(page.content);
    } catch (requestError) {
      if (requestError instanceof Error && requestError.message.trim().length > 0) {
        setError(requestError.message);
      } else {
        setError("Failed to load teachers. Please refresh and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearTeachers, token]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      clearTeachers();
      return;
    }

    void refreshTeachers();
  }, [hydrated, token, clearTeachers, refreshTeachers]);

  const value = useMemo(
    () => ({
      teachers,
      teacherPage,
      isLoading,
      error,
      refreshTeachers,
      clearTeachers,
    }),
    [teachers, teacherPage, isLoading, error, refreshTeachers, clearTeachers]
  );

  return <TeachersContext.Provider value={value}>{children}</TeachersContext.Provider>;
}

export function useTeachersState() {
  const context = useContext(TeachersContext);
  if (!context) {
    throw new Error("useTeachersState must be used within TeachersProvider");
  }

  return context;
}
