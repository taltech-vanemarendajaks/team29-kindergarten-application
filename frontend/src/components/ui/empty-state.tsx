"use client";

import type { ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export type EmptyStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionProps?: Omit<ButtonProps, "children" | "onClick">;
};

export default function EmptyState({
  title = "No data yet",
  description = "There is nothing to show right now.",
  actionLabel,
  onAction,
  actionProps,
}: EmptyStateProps) {
  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
        {actionLabel && (
          <Button onClick={onAction} variant="contained" {...actionProps}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
