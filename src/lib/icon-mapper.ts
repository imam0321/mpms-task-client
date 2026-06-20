import {
  LayoutDashboard,
  User,
  Lock,
  Shield,
  Users,
  Gift,
  Box,
  FolderKanban,
  ListTodo,
  Clock,
  FileText,
  MessageSquare,
  Activity,
  Layers,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  Lock,
  Shield,
  Users,
  Gift,
  Box,
  FolderKanban,
  ListTodo,
  Clock,
  FileText,
  MessageSquare,
  Activity,
  category: Layers, 
};

export const getIconComponent = (name: string): LucideIcon => {
  return iconMap[name] || Box;
};
export default iconMap;
