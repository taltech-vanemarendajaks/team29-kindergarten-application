"use client";

import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "@/src/context/AuthContext";
import { useTeachersState } from "@/src/context/TeachersContext";

export default function TeacherPage() {
  const { token } = useAuth();
  const { teachers, teacherPage, isLoading, error, refreshTeachers } = useTeachersState();

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={700}>
          Teacher Dashboard
        </Typography>

        <Typography color="text.secondary">
          Minimal teachers module scaffold with global state via React Context.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" size="small" onClick={() => void refreshTeachers()} disabled={!token || isLoading}>
            Refresh Teachers
          </Button>
          {teacherPage ? <Chip size="small" label={`Total: ${teacherPage.totalElements}`} /> : null}
        </Stack>

        {!token ? (
          <Typography color="text.secondary">Please sign in to load teachers from the backend.</Typography>
        ) : null}

        {isLoading ? <Typography color="text.secondary">Loading teachers...</Typography> : null}

        {error ? <Typography color="error.main">{error}</Typography> : null}

        {!isLoading && !error && token && teachers.length === 0 ? (
          <Typography color="text.secondary">No teachers found yet.</Typography>
        ) : null}

        {teachers.length > 0 ? (
          <Stack spacing={1}>
            {teachers.map((teacher) => (
              <Paper key={teacher.id} variant="outlined" sx={{ p: 1.5 }}>
                <Typography fontWeight={600}>{teacher.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {teacher.email}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
