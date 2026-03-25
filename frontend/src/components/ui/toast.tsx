"use client";

import Snackbar from "./snackbar";
import type { SnackbarProps } from "./snackbar";

export type ToastProps = SnackbarProps;

export default function Toast(props: ToastProps) {
  return <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} {...props} />;
}
