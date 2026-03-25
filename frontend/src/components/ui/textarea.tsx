"use client";

import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export type TextareaProps = TextFieldProps;

export default function Textarea(props: TextareaProps) {
  return <TextField fullWidth minRows={4} multiline size="small" variant="outlined" {...props} />;
}
