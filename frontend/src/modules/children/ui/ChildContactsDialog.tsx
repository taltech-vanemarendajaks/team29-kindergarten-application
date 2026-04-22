"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Dialog, Table } from "@/src/components/ui";
import type { TableColumn } from "@/src/components/ui";
import type { Child } from "../model/child";
import { formatFullName, formatPersonName } from "@/src/shared/utils/formatPersonName";

type ChildContactsDialogProps = {
    child: Child | null;
    open: boolean;
    onCloseAction: () => void;
};

export default function ChildContactsDialog({ child, open, onCloseAction }: ChildContactsDialogProps) {
    const columns: TableColumn<NonNullable<Child["contacts"]>[number]>[] = [
        {
            key: "fullName",
            label: "Name",
            render: (contact) => formatFullName(contact.fullName),
        },
        {
            key: "email",
            label: "Email",
            render: (contact) => contact.email || "-",
        },
    ];

    return (
        <Dialog
            open={open}
            onClose={onCloseAction}
            title={child ? `Parents of ${formatPersonName(child)}` : "Parents"}
            actions={[
                {
                    label: "Close",
                    onClick: onCloseAction,
                    variant: "text",
                    color: "inherit",
                },
            ]}
        >
            <Stack spacing={2} sx={{ mt: 1 }}>
                {child?.contacts.length ? (
                    <Table
                        columns={columns}
                        rows={child.contacts}
                        rowKey={(contact) => String(contact.id)}
                    />
                ) : (
                    <Typography color="text.secondary" variant="body2">
                        No parent details are linked to this child yet.
                    </Typography>
                )}
            </Stack>
        </Dialog>
    );
}
