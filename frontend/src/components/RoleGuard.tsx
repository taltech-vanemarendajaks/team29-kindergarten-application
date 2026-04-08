"use client";

import {ReactNode, useEffect} from "react";
import { useRouter } from "next/navigation";
import {useAuth} from "@/src/context/AuthContext";

export default function RoleGuard({ allowed, children }: { allowed: string[]; children: ReactNode }) {
    const router = useRouter();
    const { role, isAuthenticated, hydrated } = useAuth();

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (!allowed.includes(role as string)) {
            router.replace("/login");
        }
    }, [allowed, hydrated, role, isAuthenticated, router]);

    if (!hydrated) {
        return null;
    }

    return <>{children}</>;
}