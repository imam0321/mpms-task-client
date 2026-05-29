"use client"

import React from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getIconComponent } from "@/lib/icon-mapper";
import { usePathname } from "next/navigation";
import { NavSection } from "@/types/dashboard.types";

export function NavDocuments({ items }: { items: NavSection[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {items.map((section, index) => (
        <React.Fragment key={index}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item, subIndex) => {
              const Icon = getIconComponent(item.icon);
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={subIndex}>
                  <SidebarMenuButton
                    asChild
                    className={
                      isActive
                        ? "bg-linear-to-r from-surprise-pink to-surprise-purple text-white hover:text-white"
                        : ""
                    }
                  >
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </React.Fragment>
      ))}
    </SidebarGroup>
  );
}