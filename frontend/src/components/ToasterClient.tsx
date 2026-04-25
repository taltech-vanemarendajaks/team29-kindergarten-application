"use client";

import { Toaster } from "react-hot-toast";

export function ToasterClient() {
    if (typeof window === "undefined") return null;

    return <Toaster position="top-right" />;
}
