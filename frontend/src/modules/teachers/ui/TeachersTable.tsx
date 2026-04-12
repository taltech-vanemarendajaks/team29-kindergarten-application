"use client";

import { EmptyState, Table, TableRowActions } from "@/src/components/ui";
import type { TableColumn } from "@/src/components/ui";
import { formatFullName } from "@/src/shared/utils/formatPersonName";
import type { Teacher } from "../model/teacher";

type TeachersTableProps = {
    teachers: Teacher[];
    onEditAction?: (teacher: Teacher) => void;
    onDeleteAction?: (teacher: Teacher) => void;
};

export default function TeachersTable({ teachers, onEditAction, onDeleteAction }: TeachersTableProps) {
    if (teachers.length === 0) {
        return (
            <EmptyState
                title="No teachers found"
                description="Teacher user accounts will appear here once they have been created."
            />
        );
    }

    const columns: TableColumn<Teacher>[] = [
        {
            key: "fullName",
            label: "Name",
            render: (teacher) => formatFullName(teacher.fullName),
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (teacher) => (
                <TableRowActions
                    onEditAction={onEditAction ? () => onEditAction(teacher) : undefined}
                    onDeleteAction={onDeleteAction ? () => onDeleteAction(teacher) : undefined}
                />
            ),
        },
    ];

    return <Table columns={columns} rows={teachers} rowKey={(teacher) => String(teacher.id)} />;
}
