"use client";

import type { ReactNode, SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { Box, Tab, Tabs as MuiTabs } from "@mui/material";
import type { TabsProps as MuiTabsProps } from "@mui/material";

export type TabsItem = {
  label: string;
  value: string;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = Omit<MuiTabsProps, "value" | "onChange"> & {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export default function Tabs({ items, value, defaultValue, onChange, ...props }: TabsProps) {
  const fallbackValue = useMemo(() => items[0]?.value ?? "", [items]);
  const [internalValue, setInternalValue] = useState(defaultValue ?? fallbackValue);
  const selectedValue = value ?? internalValue;

  const handleChange = (_event: SyntheticEvent, nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <Box>
      <MuiTabs onChange={handleChange} value={selectedValue} {...props}>
        {items.map((item) => (
          <Tab disabled={item.disabled} key={item.value} label={item.label} value={item.value} />
        ))}
      </MuiTabs>
      {items.map((item) => (
        <Box hidden={item.value !== selectedValue} key={`${item.value}-panel`} sx={{ pt: 2 }}>
          {item.content}
        </Box>
      ))}
    </Box>
  );
}
