"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/src/validation/loginSchema";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { login } from "@/src/services/auth";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { redirectByRole } from "@/src/shared/utils/redirectByRole";
import type { MyJwtPayload } from "@/src/context/AuthContext";

export default function LoginPage() {
    const { login: saveToken } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await login(data.email, data.password);
            saveToken(res.token);

            const payload = jwtDecode<MyJwtPayload>(res.token);
            redirectByRole(payload.roles, router);

        } catch (err: any) {
            setError("password", {
                type: "server",
                message: "Invalid email or password",
            });
        }
    };


    return (
        <Paper sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <Typography variant="h4">Login</Typography>

                    <TextField
                        label="Email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        Sign in
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}