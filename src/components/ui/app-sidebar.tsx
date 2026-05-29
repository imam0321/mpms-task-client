"use client";

import * as React from "react";
import { NavDocuments } from "@/components/ui/nav-documents";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Gift } from "lucide-react";
import LogoWithTitle from "../shared/LogoWithTitle";
import { NavSection } from "@/types/dashboard.types";

export function AppSidebar({
  navbarItems,
  ...props
}: {
  navbarItems: NavSection[];
} & React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center space-x-2 px-2 py-1"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <LogoWithTitle isAbsolute={false} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavDocuments items={navbarItems} />
      </SidebarContent>
    </Sidebar>
  );
}
