"use client";

import { FormControlLabel, Switch as MuiSwitch } from "@mui/material";
import type { SwitchProps as MuiSwitchProps } from "@mui/material";

export type SwitchProps = MuiSwitchProps & {
  label: string;
};

export default function Switch({ label, ...props }: SwitchProps) {
  return <FormControlLabel control={<MuiSwitch {...props} />} label={label} />;
}
