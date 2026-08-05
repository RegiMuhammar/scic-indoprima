import { AppShell } from "@/components/layout/AppShell";

/**
 * Dashboard route group layout — wraps all protected pages
 * with the AppShell (Sidebar + Topbar)
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
