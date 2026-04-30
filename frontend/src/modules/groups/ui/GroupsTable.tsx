"use client";

import { EmptyState, Table, TableRowActions } from "@/src/components/ui";
import type { TableColumn, SortDirection } from "@/src/components/ui";
import { formatFullName } from "@/src/shared/utils/formatPersonName";
import type { Group } from "../model/group";

type GroupsTableProps = {
  groups: Group[];
  onEditAction?: (group: Group) => void;
  onDeleteAction?: (group: Group) => void;
  sortField?: string;
  sortDirection?: SortDirection;
  onSortChange?: (field: string, direction: SortDirection) => void;
};

export default function GroupsTable({
  groups,
  onEditAction,
  onDeleteAction,
  sortField,
  sortDirection,
  onSortChange,
}: GroupsTableProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="No groups found"
        description="Create the first group to start organizing teachers into groups."
      />
    );
  }

  const columns: TableColumn<Group>[] = [
    { key: "name", label: "Name", sortable: true, sortKey: "name" },
    {
      key: "ageRange",
      label: "Age Range",
      sortable: true,
      sortKey: "ageRange",
      render: (group) => group.ageRange ?? "-",
    },
    {
      key: "teacher",
      label: "Teacher",
      render: (group) =>
        group.teacher ? formatFullName(group.teacher.fullName) : "-",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (group) => (
        <TableRowActions
          onEditAction={onEditAction ? () => onEditAction(group) : undefined}
          onDeleteAction={
            onDeleteAction ? () => onDeleteAction(group) : undefined
          }
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={groups}
      rowKey={(group) => String(group.id)}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
    />
  );
}
