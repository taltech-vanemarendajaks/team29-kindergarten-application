"use client";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "./tooltip";

export type TableRowActionsProps = {
    onEditAction?: () => void;
    onDeleteAction?: () => void;
    editLabel?: string;
    deleteLabel?: string;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
};

export default function TableRowActions({
    onEditAction,
    onDeleteAction,
    editLabel = "Edit",
    deleteLabel = "Delete",
    editDisabled = false,
    deleteDisabled = false,
}: TableRowActionsProps) {
    return (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Tooltip title={editLabel}>
                <span>
                    <IconButton
                        size="small"
                        color="secondary"
                        onClick={onEditAction}
                        disabled={!onEditAction || editDisabled}
                        aria-label={editLabel}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title={deleteLabel}>
                <span>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={onDeleteAction}
                        disabled={!onDeleteAction || deleteDisabled}
                        aria-label={deleteLabel}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
        </Stack>
    );
}
