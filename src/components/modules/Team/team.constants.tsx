import { Shield, Briefcase, UserCheck } from "lucide-react";
import { UserRole } from "@/types/api.types";

export const roleBadges: Record<UserRole, string> = {
  Admin: "bg-red-500/10 text-red-400 border-red-500/20",
  Manager: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Member: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export const roleIcons: Record<UserRole, React.ReactNode> = {
  Admin: <Shield className="h-3 w-3" />,
  Manager: <Briefcase className="h-3 w-3" />,
  Member: <UserCheck className="h-3 w-3" />,
};
