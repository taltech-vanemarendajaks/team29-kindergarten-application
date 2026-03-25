"use client";

import { Alert as MuiAlert } from "@mui/material";
import type { AlertProps as MuiAlertProps } from "@mui/material";

export type AlertProps = MuiAlertProps;

export default function Alert(props: AlertProps) {
  return <MuiAlert variant="filled" {...props} />;
}
