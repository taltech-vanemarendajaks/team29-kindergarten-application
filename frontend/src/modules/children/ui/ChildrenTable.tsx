"use client";

import Typography from "@mui/material/Typography";
import { Button, EmptyState, Table } from "@/src/components/ui";
import type { TableColumn } from "@/src/components/ui";
import { calculateAge } from "@/src/shared/utils/calculateAge";
import { formatPersonName } from "@/src/shared/utils/formatPersonName";
import type { Child } from "../model/child";

type ChildrenTableProps = {
    rows: Child[];
    onViewContactsAction?: (child: Child) => void;
    onManageGroupAction?: (child: Child) => void;
    onViewGroupAction?: (child: Child) => void;
};

export default function ChildrenTable({
    rows,
    onViewContactsAction,
    onManageGroupAction,
    onViewGroupAction,
}: ChildrenTableProps) {
    if (rows.length === 0) {
        return (
            <EmptyState
                title="No children found"
                description="Children will appear here after parents start adding them."
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
            key: "contacts",
            label: "Parents",
            render: (child) =>
                onViewContactsAction ? (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => onViewContactsAction(child)}
                        sx={{ px: 0, minWidth: 0 }}
                    >
                        View parents
                    </Button>
                ) : (
                    <Typography variant="body2">View parents</Typography>
                ),
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (child) =>
                onManageGroupAction ? (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => onManageGroupAction(child)}
                    >
                        {child.group ? "Change group" : "Assign group"}
                    </Button>
                ) : null,
        },
    ];

    return <Table columns={columns} rows={rows} rowKey={(child) => String(child.id)} />;
}
