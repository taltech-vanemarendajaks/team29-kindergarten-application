export function redirectByRole(roles: string[], router: any) {
    if (roles.includes("SUPER_ADMIN") || roles.includes("KINDERGARTEN_ADMIN")) {
        router.push("/dashboard/admin");
        return;
    }

    if (roles.includes("TEACHER")) {
        router.push("/dashboard/teacher");
        return;
    }

    if (roles.includes("PARENT")) {
        router.push("/dashboard/parent");
        return;
    }

    router.push("/dashboard");
}