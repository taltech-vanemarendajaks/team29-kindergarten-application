export function redirectByRole(roles: string[], router: any) {
    if (roles.includes("SUPER_ADMIN") || roles.includes("KINDERGARTEN_ADMIN")) {
        router.push("/kindergarten-admin/dashboard");
        return;
    }

    if (roles.includes("TEACHER")) {
        router.push("/teacher/dashboard");
        return;
    }

    if (roles.includes("PARENT")) {
        router.push("/parent/dashboard");
        return;
    }
    // fallback
    router.push("/");
}