"use client";

import { EmptyState, Table, TableRowActions } from "@/src/components/ui";
import type { TableColumn } from "@/src/components/ui";
import { formatPersonName } from "@/src/shared/utils/formatPersonName";
import type { Group } from "../model/group";

type GroupsTableProps = {
    groups: Group[];
    onEditAction?: (group: Group) => void;
    onDeleteAction?: (group: Group) => void;
};

export default function GroupsTable({ groups, onEditAction, onDeleteAction }: GroupsTableProps) {
    if (groups.length === 0) {
        return (
            <EmptyState
                title="No groups found"
                description="Create the first group to start organizing teachers into groups."
            />
        );
    }

    const columns: TableColumn<Group>[] = [
        { key: "name", label: "Name" },
        {
            key: "ageRange",
            label: "Age Range",
            render: (group) => group.ageRange ?? "-",
        },
        {
            key: "teacher",
            label: "Teacher",
            render: (group) =>
                group.teacher
                    ? formatPersonName(group.teacher)
                    : "-",
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (group) => (
                <TableRowActions
                    onEditAction={onEditAction ? () => onEditAction(group) : undefined}
                    onDeleteAction={onDeleteAction ? () => onDeleteAction(group) : undefined}
                />
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            rows={groups}
            rowKey={(group) => String(group.id)}
        />
    );
}
