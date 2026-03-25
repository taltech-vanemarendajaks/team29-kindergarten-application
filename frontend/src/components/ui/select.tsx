"use client";

import { MenuItem, TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<TextFieldProps, "select" | "children"> & {
  options: SelectOption[];
};

export default function Select({ options, ...props }: SelectProps) {
  return (
    <TextField fullWidth select size="small" variant="outlined" {...props}>
      {options.map((option) => (
        <MenuItem disabled={option.disabled} key={String(option.value)} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
