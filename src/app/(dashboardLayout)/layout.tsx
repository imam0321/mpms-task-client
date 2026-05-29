import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getNavItemsByRole } from "@/lib/navItems.config";
import { UserRole } from "@/lib/auth.utils";
import { getUserInfo } from "@/services/auth/getUserInfo";
import AuthProvider from "@/context/AuthProvider";

export const dynamic = "force-dynamic";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();
  const navbarItems = getNavItemsByRole(userInfo?.role as UserRole);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" navbarItems={navbarItems} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6 px-4">
              <AuthProvider user={userInfo}>{children}</AuthProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}