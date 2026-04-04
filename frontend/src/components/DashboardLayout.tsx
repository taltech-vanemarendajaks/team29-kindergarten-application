import type { ReactNode } from "react";
import MainLayout from "@/src/app/main-layout";
import {dashboardNavItems} from "@/src/app/navigation";


type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <MainLayout
            footerText="Dashboard area"
            navItems={dashboardNavItems}
            title="Kindergarten Dashboard"
        >
            {children}
        </MainLayout>
    );
}