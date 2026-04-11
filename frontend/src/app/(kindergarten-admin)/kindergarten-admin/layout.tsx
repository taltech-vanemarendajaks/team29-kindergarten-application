import RoleGuard from "@/src/components/RoleGuard";

import { adminNavItems } from "@/src/components/navigation/adminNav";
import {ReactNode} from "react";
import MainLayout from "@/src/app/main-layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowed={["KINDERGARTEN_ADMIN", "SUPER_ADMIN"]}>
            <MainLayout
                title="Kindergarten Admin"
                navItems={adminNavItems}
                footerText="Kindergarten Admin Portal"
            >
                {children}
            </MainLayout>
        </RoleGuard>
    );
}
