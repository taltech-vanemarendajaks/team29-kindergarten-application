import type { ReactNode } from "react";
import MainLayout from "../main-layout";
import { publicNavItems } from "../navigation";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <MainLayout footerText="Public area" navItems={publicNavItems} title="Kindergarten Portal">
      {children}
    </MainLayout>
  );
}
