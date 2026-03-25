"use client";

import Loader from "./loader";
import type { LoaderProps } from "./loader";

export type SpinnerProps = LoaderProps;

export default function Spinner(props: SpinnerProps) {
  return <Loader {...props} />;
}
