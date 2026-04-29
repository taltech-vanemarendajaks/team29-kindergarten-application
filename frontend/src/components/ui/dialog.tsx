"use client";

import type { ReactNode } from "react";
import { Button, Dialog as MuiDialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { ButtonProps, DialogProps as MuiDialogProps } from "@mui/material";

export type DialogAction = {
  label: string;
  onClick?: () => void;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
  autoFocus?: boolean;
  disabled?: boolean;
};

export type DialogProps = Omit<MuiDialogProps, "title"> & {
  title?: ReactNode;
  actions?: DialogAction[];
};

export default function Dialog({ title, actions, children, ...props }: DialogProps) {
  return (
    <MuiDialog fullWidth maxWidth="sm" {...props}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {actions && actions.length > 0 && (
        <DialogActions>
          {actions.map((action) => (
            <Button
              autoFocus={action.autoFocus}
              color={action.color ?? "primary"}
              disabled={action.disabled}
              key={action.label}
              onClick={action.onClick}
              variant={action.variant ?? "contained"}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </MuiDialog>
  );
}
