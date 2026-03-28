import type { ReactNode } from "react";
import MainLayout from "../main-layout";
import { dashboardNavItems } from "../navigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <MainLayout footerText="Dashboard area" navItems={dashboardNavItems} title="Kindergarten Dashboard">
      {children}
    </MainLayout>
  );
}
