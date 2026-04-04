"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function LogoutButton() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <Button color="inherit" onClick={handleLogout}>
            Logout
        </Button>
    );
}