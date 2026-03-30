"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!token) {
            router.replace("/login");
        } else {
            setReady(true);
        }
    }, [token, router]);

    if (!ready) return null;

    return <>{children}</>;
}