"use client";

import Alert from "./alert";
import { Snackbar as MuiSnackbar } from "@mui/material";
import type { AlertColor, SnackbarProps as MuiSnackbarProps } from "@mui/material";

export type SnackbarProps = Omit<MuiSnackbarProps, "children"> & {
  message: string;
  severity?: AlertColor;
};

export default function Snackbar({ message, severity = "info", ...props }: SnackbarProps) {
  return (
    <MuiSnackbar autoHideDuration={3000} {...props}>
      <Alert severity={severity}>{message}</Alert>
    </MuiSnackbar>
  );
}
