"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import type { AlertColor } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  Button,
  ConfirmDialog,
  ErrorState,
  Pagination,
  Spinner,
  Toast,
} from "@/src/components/ui";
import { useAuth } from "@/src/context/AuthContext";
import type { Group, UpdateGroupPayload } from "@/src/modules/groups";
import {
  createGroup,
  deleteGroup,
  GroupFormDialog,
  GroupsTable,
  updateGroup,
  useGroups,
} from "@/src/modules/groups";
import { useAvailableTeacherOptions } from "@/src/modules/teachers";

export default function KindergartenAdminGroupsPage() {
  const { token, hydrated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { groups, groupPage, loading, error, refetch } = useGroups(
    token,
    page - 1,
    10,
    hydrated,
    search,
    sortField,
    sortDirection,
  );
  const {
    teachers: availableTeachersForCreate,
    loading: createTeachersLoading,
    error: createTeachersError,
    refetch: refetchCreateTeachers,
  } = useAvailableTeacherOptions(token, null, hydrated);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [submitMode, setSubmitMode] = useState<"create" | "edit" | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  } | null>(null);
  const {
    teachers: availableTeachersForEdit,
    loading: editTeachersLoading,
    error: editTeachersError,
    refetch: refetchEditTeachers,
  } = useAvailableTeacherOptions(
    token,
    groupToEdit?.id,
    hydrated && !!groupToEdit,
  );

  const refreshGroupData = () => {
    refetch();
    refetchCreateTeachers();
    if (groupToEdit) {
      refetchEditTeachers();
    }
  };

  const handleCreate = async (payload: UpdateGroupPayload) => {
    if (!token) {
      return;
    }

    try {
      setSubmitMode("create");
      await createGroup(token, payload);
      refreshGroupData();
      setCreateDialogOpen(false);
      setNotification({
        open: true,
        message: "Group created successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      const details = err instanceof Error ? err.message : null;
      setNotification({
        open: true,
        message: details
          ? `Failed to create group: ${details}`
          : "Failed to create group",
        severity: "error",
      });
    } finally {
      setSubmitMode(null);
    }
  };

  const handleDelete = async (groupId: number) => {
    if (!token) {
      return;
    }

    try {
      await deleteGroup(groupId, token);
      refreshGroupData();
      setGroupToDelete(null);
      setNotification({
        open: true,
        message: "Group deleted successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      const details = err instanceof Error ? err.message : null;
      setNotification({
        open: true,
        message: details
          ? `Failed to delete group: ${details}`
          : "Failed to delete group",
        severity: "error",
      });
    }
  };

  const handleSave = async (payload: UpdateGroupPayload) => {
    if (!token || !groupToEdit) {
      return;
    }

    try {
      setSubmitMode("edit");
      await updateGroup(groupToEdit.id, token, payload);
      refreshGroupData();
      setGroupToEdit(null);
      setNotification({
        open: true,
        message: "Group updated successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      const details = err instanceof Error ? err.message : null;
      setNotification({
        open: true,
        message: details
          ? `Failed to update group: ${details}`
          : "Failed to update group",
        severity: "error",
      });
    } finally {
      setSubmitMode(null);
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
            Groups
          </Typography>
          <Button color="primary" onClick={() => setCreateDialogOpen(true)}>
            Add group
          </Button>
        </Stack>

        <TextField
          size="small"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ width: 280 }}
        />

        {loading && groups.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Spinner centered={false} size={24} />
              <Typography>Loading groups...</Typography>
            </Stack>
          </Paper>
        ) : error ? (
          <ErrorState
            title="Failed to load groups"
            description={error}
            actionLabel="Try again"
            onAction={() => {
              void refetch();
            }}
          />
        ) : (
          <>
            <GroupsTable
              groups={groups}
              onEditAction={(group) => setGroupToEdit(group)}
              onDeleteAction={(group) => setGroupToDelete(group)}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={(field, direction) => {
                setSortField(field);
                setSortDirection(direction);
                setPage(1);
              }}
            />
            {groupPage && groupPage.totalElements > 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                {groupPage.number * groupPage.size + 1}-
                {Math.min(
                  (groupPage.number + 1) * groupPage.size,
                  groupPage.totalElements,
                )}{" "}
                of {groupPage.totalElements}
              </Typography>
            ) : null}
            {(groupPage?.totalPages ?? 0) > 1 ? (
              <Pagination
                count={groupPage?.totalPages ?? 0}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            ) : null}
          </>
        )}

        <GroupFormDialog
          key={createDialogOpen ? "create-group-open" : "create-group-closed"}
          open={createDialogOpen}
          title="Add group"
          submitLabel="Create"
          teachers={availableTeachersForCreate}
          teachersLoading={createTeachersLoading}
          teachersError={createTeachersError}
          loading={submitMode === "create"}
          onCloseAction={() => setCreateDialogOpen(false)}
          onSubmitAction={handleCreate}
        />

        <GroupFormDialog
          key={
            groupToEdit ? `edit-group-${groupToEdit.id}` : "edit-group-closed"
          }
          open={!!groupToEdit}
          title="Edit group"
          submitLabel="Save"
          group={groupToEdit}
          teachers={availableTeachersForEdit}
          teachersLoading={editTeachersLoading}
          teachersError={editTeachersError}
          loading={submitMode === "edit"}
          onCloseAction={() => setGroupToEdit(null)}
          onSubmitAction={handleSave}
        />

        <ConfirmDialog
          open={!!groupToDelete}
          title="Delete group"
          message={
            groupToDelete
              ? `Are you sure you want to delete "${groupToDelete.name}"?`
              : ""
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onCancel={() => setGroupToDelete(null)}
          onConfirm={() => {
            if (groupToDelete) {
              void handleDelete(groupToDelete.id);
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
