"use client";

import type { ReactNode } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export type ErrorStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionProps?: Omit<ButtonProps, "children" | "onClick">;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again or contact support if the issue persists.",
  actionLabel = "Try again",
  onAction,
  actionProps,
}: ErrorStateProps) {
  return (
    <Box sx={{ border: 1, borderColor: "error.light", borderRadius: 2, p: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
        <Alert severity="error">{title}</Alert>
        {actionLabel && (
          <Button color="error" onClick={onAction} variant="outlined" {...actionProps}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
