export type UserRole = "Admin" | "Manager" | "Member"

export type RouteConfig = {
  exact: string[],
  patterns: RegExp[]
}

export const authRoutes = ["/login", "/register"];

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/dashboard/my-profile"],
  patterns: [],
}

export const adminOnlyRoutes: RouteConfig = {
  exact: ["/dashboard/admin"],
  patterns: [],
}

export const managerOnlyRoutes: RouteConfig = {
  exact: ["/dashboard/manager"],
  patterns: [],
}

export const memberOnlyRoutes: RouteConfig = {
  exact: ["/dashboard/member"],
  patterns: [],
}

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
}

export const isRouterMatches = (pathname: string, routes: RouteConfig): boolean => {
  if (routes.exact.includes(pathname)) {
    return true
  }

  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
}

export const getRouteOwner = (pathname: string): UserRole | "Common" | null => {
  if (isRouterMatches(pathname, adminOnlyRoutes)) return "Admin";
  if (isRouterMatches(pathname, managerOnlyRoutes)) return "Manager";
  if (isRouterMatches(pathname, commonProtectedRoutes)) return "Common";
  if (isRouterMatches(pathname, memberOnlyRoutes)) return "Member";
  return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "Admin":
      return "/dashboard/admin";
    case "Manager":
      return "/dashboard/manager";
    case "Member":
      return "/dashboard/member";
    default:
      return "/"
  }
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
  const routeOwner = getRouteOwner(redirectPath);
  if (routeOwner === null || routeOwner === "Common") {
    return true
  }

  if (routeOwner === role) {
    return true
  }

  return false
}