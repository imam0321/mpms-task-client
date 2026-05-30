
import { getDefaultDashboardRoute, UserRole } from "./auth.utils";
import { NavSection } from "@/types/dashboard.types";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["Admin", "Manager", "Member"],
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "System Management",
    items: [
      {
        title: "Team Members",
        href: "/dashboard/admin/users",
        icon: "Users",
        roles: ["Admin"],
      },
      {
        title: "Time Tracker",
        href: "/dashboard/admin/timelogs",
        icon: "Clock",
        roles: ["Admin"],
      },
      {
        title: "System Reports",
        href: "/dashboard/admin/reports",
        icon: "FileText",
        roles: ["Admin"],
      },
    ],
  },
];

export const managerNavItems: NavSection[] = [
  {
    title: "Project Management",
    items: [
      {
        title: "My Projects",
        href: "/dashboard/manager/projects",
        icon: "FolderKanban",
        roles: ["Manager"],
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Time Logs",
        href: "/dashboard/manager/timelogs",
        icon: "Clock",
        roles: ["Manager"],
      },
    ],
  },
];

export const memberNavItems: NavSection[] = [
  {
    title: "My Workspace",
    items: [
      {
        title: "My Projects",
        href: "/dashboard/member/projects",
        icon: "FolderKanban",
        roles: ["Member"],
      },
      {
        title: "My Time logs",
        href: "/dashboard/member/timelogs",
        icon: "Clock",
        roles: ["Member"],
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "Admin":
      return [...commonNavItems, ...adminNavItems];
    case "Manager":
      return [...commonNavItems, ...managerNavItems];
    case "Member":
      return [...commonNavItems, ...memberNavItems];
    default:
      return commonNavItems;
  }
};

