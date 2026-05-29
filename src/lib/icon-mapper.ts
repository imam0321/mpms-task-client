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
  category: Layers, // Map the non-standard "category" string to Lucide's Layers icon
};

export const getIconComponent = (name: string): LucideIcon => {
  // Return the mapped icon or fall back to Box if not found
  return iconMap[name] || Box;
};
export default iconMap;
