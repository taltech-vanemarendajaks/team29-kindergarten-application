"use client";

import { Paper, Stack, TextField, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { register as registerUser, login } from "@/src/services/auth";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/src/validation/registerSchema";

export default function RegisterPage() {
    const router = useRouter();
    const { login: saveToken } = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser({
                fullName: data.fullName,
                email: data.email,
                password: data.password
            });

            const auth = await login(data.email, data.password);
            saveToken(auth.token);

            router.push("/parent/dashboard");

        } catch (err: any) {
            if (err?.response?.data?.error) {
                setError("email", {
                    type: "server",
                    message: err.response.data.error,
                });
                return;
            }

            alert("Registration failed");
        }
    };

  return (
    <Paper sx={{ maxWidth: 500, mx: "auto", mt: 8, p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h4" textAlign="center">Create Account</Typography>

                    <TextField
                        fullWidth
                        label="Full name"
                        {...register("fullName")}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        Create account
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}
