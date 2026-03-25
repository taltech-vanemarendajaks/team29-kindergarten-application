"use client";

import { FormControlLabel, Radio as MuiRadio } from "@mui/material";
import type { RadioProps as MuiRadioProps } from "@mui/material";

export type RadioProps = MuiRadioProps & {
  label: string;
};

export default function Radio({ label, ...props }: RadioProps) {
  return <FormControlLabel control={<MuiRadio {...props} />} label={label} />;
}
