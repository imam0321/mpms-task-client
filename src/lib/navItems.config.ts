
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
        title: "Projects",
        href: "/dashboard/admin/projects",
        icon: "FolderKanban",
        roles: ["Admin"],
      },
    ],
  },
  {
    title: "Agile Tracking",
    items: [
      {
        title: "Sprints",
        href: "/dashboard/admin/sprints",
        icon: "Activity",
        roles: ["Admin"],
      },
      {
        title: "Task Board",
        href: "/dashboard/admin/tasks",
        icon: "ListTodo",
        roles: ["Admin"],
      },
    ],
  },
  {
    title: "Operations",
    items: [
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
      {
        title: "Sprints",
        href: "/dashboard/manager/sprints",
        icon: "Activity",
        roles: ["Manager"],
      },
    ],
  },
  {
    title: "Agile Boards",
    items: [
      {
        title: "Task Tracking",
        href: "/dashboard/manager/tasks",
        icon: "ListTodo",
        roles: ["Manager"],
      },
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
        title: "My Tasks",
        href: "/dashboard/member/tasks",
        icon: "ListTodo",
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

