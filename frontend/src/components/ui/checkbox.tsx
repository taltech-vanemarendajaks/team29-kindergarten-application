"use client";

import { Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";
import type { CheckboxProps as MuiCheckboxProps } from "@mui/material";

export type CheckboxProps = MuiCheckboxProps & {
  label: string;
};

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return <FormControlLabel control={<MuiCheckbox {...props} />} label={label} />;
}
