"use client";

import Input from "./input";
import type { InputProps } from "./input";

export type SearchInputProps = Omit<InputProps, "type">;

export default function SearchInput(props: SearchInputProps) {
  return <Input placeholder="Search..." type="search" {...props} />;
}
