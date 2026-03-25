"use client";

import type { ReactNode } from "react";
import Dialog from "./dialog";
import type { DialogProps } from "./dialog";
import type { ButtonProps } from "@mui/material";

export type ConfirmDialogProps = Omit<DialogProps, "actions" | "children"> & {
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmColor?: ButtonProps["color"];
};

export default function ConfirmDialog({
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmColor = "error",
  ...props
}: ConfirmDialogProps) {
  return (
    <Dialog
      actions={[
        { label: cancelLabel, onClick: onCancel, variant: "text", color: "inherit" },
        { label: confirmLabel, onClick: onConfirm, variant: "contained", color: confirmColor, autoFocus: true },
      ]}
      title={title}
      {...props}
    >
      {message}
    </Dialog>
  );
}
