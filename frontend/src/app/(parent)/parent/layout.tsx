import RoleGuard from "@/src/components/RoleGuard";

import { parentNavItems } from "@/src/components/navigation/parentNav";
import MainLayout from "@/src/app/main-layout";
import {ReactNode} from "react";

export default function ParentLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowed={["PARENT"]}>
            <MainLayout
                title="Parent Dashboard"
                navItems={parentNavItems}
                footerText="Parent Portal"
            >
                {children}
            </MainLayout>
        </RoleGuard>
    );
}