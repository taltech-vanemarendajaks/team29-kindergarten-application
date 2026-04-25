export type NavItem =
    | { label: string; href: string }
    | {
  label: string;
  children: { label: string; href: string }[]; // dropdown
};


export const dashboardNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/teacher", label: "Teacher" },
  { href: "/parent", label: "Parent" },
  { href: "/logout", label: "Logout" }
];

export const publicNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" }
];