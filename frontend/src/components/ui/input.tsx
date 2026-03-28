"use client";

import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export type InputProps = TextFieldProps;

export default function Input(props: InputProps) {
  return <TextField fullWidth size="small" variant="outlined" {...props} />;
}
