export type NavItem = {
  href: string;
  label: string;
};

export const dashboardNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/teacher", label: "Teacher" },
  { href: "/parent", label: "Parent" },
];

export const publicNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];
