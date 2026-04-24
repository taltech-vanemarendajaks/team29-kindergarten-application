"use client";

import { Button, EmptyState, Table } from "@/src/components/ui";
import type { TableColumn } from "@/src/components/ui";
import { calculateAge } from "@/src/shared/utils/calculateAge";
import { formatPersonName } from "@/src/shared/utils/formatPersonName";
import type { Child } from "../model/child";

type UnassignedChildrenTableProps = {
    rows: Child[];
    onViewParentsAction?: (child: Child) => void;
    onAssignGroupAction?: (child: Child) => void;
    onViewGroupAction?: (child: Child) => void;
};

export default function UnassignedChildrenTable({
    rows,
    onViewParentsAction,
    onAssignGroupAction,
    onViewGroupAction,
}: UnassignedChildrenTableProps) {
    if (rows.length === 0) {
        return (
            <EmptyState
                title="No unassigned children"
                description="All children have a group."
            />
        );
    }

    const columns: TableColumn<Child>[] = [
        {
            key: "name",
            label: "Child",
            render: (child) => formatPersonName(child),
        },
        {
            key: "age",
            label: "Age",
            render: (child) => {
                const age = calculateAge(child.birthDate);
                return age === null ? "-" : `${age}`;
            },
        },
        {
            key: "group",
            label: "Group",
            render: (child) =>
                child.group && onViewGroupAction ? (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => onViewGroupAction(child)}
                        sx={{ px: 0, minWidth: 0 }}
                    >
                        {child.group.name}
                    </Button>
                ) : (
                    child.group?.name ?? "-"
                ),
        },
        {
            key: "parents",
            label: "Parents",
            render: (child) => (
                <Button
                    size="small"
                    variant="text"
                    onClick={() => onViewParentsAction?.(child)}
                    sx={{ px: 0, minWidth: 0 }}
                >
                    View parents
                </Button>
            ),
        },
        {
            key: "createdAt",
            label: "Date added",
            render: (child) => {
                const date = new Date(child.createdAt);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                return `${day}.${month}.${year}`;
            },
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (child) => (
                <Button
                    size="small"
                    variant="text"
                    onClick={() => onAssignGroupAction?.(child)}
                >
                    Assign group
                </Button>
            ),
        },
    ];

    return <Table columns={columns} rows={rows} rowKey={(child) => String(child.id)} />;
}
