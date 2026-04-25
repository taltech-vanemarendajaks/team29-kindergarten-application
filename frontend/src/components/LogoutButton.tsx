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
        <Button
            color="inherit"
            onClick={handleLogout}
            variant="text"
            sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 400,
                paddingX: 1.5,
                paddingY: 0.75,
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                },
            }}
        >
            Logout
        </Button>
    );
}
