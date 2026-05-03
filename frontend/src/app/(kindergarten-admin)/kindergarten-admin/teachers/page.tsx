"use client";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import type { AlertColor } from "@mui/material";
import { useState } from "react";
import {
  Button,
  ConfirmDialog,
  ErrorState,
  Pagination,
  Spinner,
  Toast,
} from "@/src/components/ui";
import { useAuth } from "@/src/context/AuthContext";
import {
  createTeacherUser,
  deleteTeacherUser,
  updateTeacherUser,
} from "@/src/modules/users";
import type { Teacher } from "@/src/modules/teachers";
import {
  TeacherFormDialog,
  type TeacherFormValues,
  TeachersTable,
  useTeachers,
} from "@/src/modules/teachers";

export default function KindergartenAdminTeachersPage() {
  const { token, hydrated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { teachers, teacherPage, loading, error, refetch } = useTeachers(
    token,
    page - 1,
    10,
    hydrated,
    search,
    sortField,
    sortDirection,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [submitMode, setSubmitMode] = useState<"create" | "edit" | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  } | null>(null);

  const handleCreate = async (values: TeacherFormValues) => {
    if (!token || !values.password) return;
    try {
      setSubmitMode("create");
      await createTeacherUser(token, {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      refetch();
      setCreateDialogOpen(false);
      setNotification({
        open: true,
        message: "Teacher created successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      const details = err instanceof Error ? err.message : null;
      setNotification({
        open: true,
        message: details
          ? `Failed to create teacher: ${details}`
          : "Failed to create teacher",
        severity: "error",
      });
    } finally {
      setSubmitMode(null);
    }
  };

  const handleEdit = async (values: TeacherFormValues) => {
    if (!token || !teacherToEdit) return;
    try {
      setSubmitMode("edit");
      await updateTeacherUser(teacherToEdit.id, token, {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      refetch();
      setTeacherToEdit(null);
      setNotification({
        open: true,
        message: "Teacher updated successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      const details = err instanceof Error ? err.message : null;
      setNotification({
        open: true,
        message: details
          ? `Failed to update teacher: ${details}`
          : "Failed to update teacher",
        severity: "error",
      });
    } finally {
      setSubmitMode(null);
    }
  };

  const handleDelete = async (teacherId: number) => {
    if (!token) return;
    try {
      await deleteTeacherUser(teacherId, token);
      refetch();
      setTeacherToDelete(null);
      setNotification({
        open: true,
        message: "Teacher deleted successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      const details = err instanceof Error ? err.message : null;
      setNotification({
        open: true,
        message: details
          ? `Failed to delete teacher: ${details}`
          : "Failed to delete teacher",
        severity: "error",
      });
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 1 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight={700}>
            Teachers
          </Typography>
          <Button color="primary" onClick={() => setCreateDialogOpen(true)}>
            Add teacher
          </Button>
        </Stack>

        <TextField
          size="small"
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ width: 280 }}
        />

        {loading && teachers.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Spinner centered={false} size={24} />
              <Typography>Loading teachers...</Typography>
            </Stack>
          </Paper>
        ) : error ? (
          <ErrorState
            title="Failed to load teachers"
            description={error}
            actionLabel={undefined}
          />
        ) : (
          <>
            <TeachersTable
              teachers={teachers}
              onEditAction={(teacher) => setTeacherToEdit(teacher)}
              onDeleteAction={(teacher) => setTeacherToDelete(teacher)}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={(field, direction) => {
                setSortField(field);
                setSortDirection(direction);
                setPage(1);
              }}
            />
            {teacherPage && teacherPage.totalElements > 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                {teacherPage.number * teacherPage.size + 1}-
                {Math.min(
                  (teacherPage.number + 1) * teacherPage.size,
                  teacherPage.totalElements,
                )}{" "}
                of {teacherPage.totalElements}
              </Typography>
            ) : null}
            {(teacherPage?.totalPages ?? 0) > 1 ? (
              <Pagination
                count={teacherPage?.totalPages ?? 0}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            ) : null}
          </>
        )}

        <TeacherFormDialog
          key={
            createDialogOpen ? "create-teacher-open" : "create-teacher-closed"
          }
          open={createDialogOpen}
          title="Add teacher"
          submitLabel="Create"
          loading={submitMode === "create"}
          requirePassword
          onCloseAction={() => setCreateDialogOpen(false)}
          onSubmitAction={handleCreate}
        />

        <TeacherFormDialog
          key={
            teacherToEdit
              ? `edit-teacher-${teacherToEdit.id}`
              : "edit-teacher-closed"
          }
          open={!!teacherToEdit}
          title="Edit teacher"
          submitLabel="Save"
          teacher={teacherToEdit}
          loading={submitMode === "edit"}
          requirePassword={false}
          onCloseAction={() => setTeacherToEdit(null)}
          onSubmitAction={handleEdit}
        />

        <ConfirmDialog
          open={!!teacherToDelete}
          title="Delete teacher"
          message={
            teacherToDelete
              ? `Are you sure you want to delete "${teacherToDelete.fullName}"?`
              : ""
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onCancel={() => setTeacherToDelete(null)}
          onConfirm={() => {
            if (teacherToDelete) {
              void handleDelete(teacherToDelete.id);
            }
          }}
        />

        <Toast
          open={!!notification?.open}
          onClose={(_, reason) => {
            if (reason !== "clickaway") {
              setNotification(null);
            }
          }}
          message={notification?.message ?? ""}
          severity={notification?.severity ?? "info"}
        />
      </Stack>
    </Paper>
  );
}
