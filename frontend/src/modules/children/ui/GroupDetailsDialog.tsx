"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Card, Dialog } from "@/src/components/ui";
import type { Group } from "@/src/modules/groups";
import { formatFullName } from "@/src/shared/utils/formatPersonName";

type GroupDetailsDialogProps = {
    group: Group | null;
    open: boolean;
    loading?: boolean;
    error?: string | null;
    onCloseAction: () => void;
};

export default function GroupDetailsDialog({
    group,
    open,
    loading = false,
    error = null,
    onCloseAction,
}: GroupDetailsDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCloseAction}
            title="Group Details"
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
                {loading ? (
                    <Typography color="text.secondary" variant="body2">
                        Loading group details...
                    </Typography>
                ) : error ? (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                ) : group ? (
                    <Card variant="outlined">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "minmax(110px, 140px) 1fr",
                                rowGap: 2,
                                columnGap: 2,
                                alignItems: "start",
                            }}
                        >
                            <Typography color="text.secondary" variant="body2">
                                Name
                            </Typography>
                            <Typography variant="body2">{group.name}</Typography>

                            <Typography color="text.secondary" variant="body2">
                                Age range
                            </Typography>
                            <Typography variant="body2">{group.ageRange || "-"}</Typography>

                            <Typography color="text.secondary" variant="body2">
                                Teacher
                            </Typography>
                            <Typography variant="body2">
                                {group.teacher ? formatFullName(group.teacher.fullName) : "-"}
                            </Typography>
                        </Box>
                    </Card>
                ) : (
                    <Typography color="text.secondary" variant="body2">
                        No group selected.
                    </Typography>
                )}
            </Stack>
        </Dialog>
    );
}
