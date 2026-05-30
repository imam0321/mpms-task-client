import { IProjectStats } from "@/types/api.types";
import {
  CheckCircle2,
  DollarSign,
  FolderDot,
  FolderKanban,
} from "lucide-react";

export default function StatsCard({
  projectStats,
}: {
  projectStats: IProjectStats[];
}) {
  const activeProjects = projectStats.filter(
    (p) => p.project?.status === "active"
  ).length;

  const completedProjects = projectStats.filter(
    (p) => p.project?.status === "completed"
  ).length;

  const totalBudget = projectStats.reduce(
    (sum, p) => sum + (p.budget || 0),
    0
  );

  const stats = [
    {
      title: "Total Projects",
      value: projectStats.length,
      change: "All departments included",
      icon: FolderDot,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      change: "Currently running",
      icon: FolderKanban,
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      change: "Finished and secured",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Budget",
      value: `$${totalBudget.toLocaleString()}`,
      change: "Based on project costs",
      icon: DollarSign,
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-zinc-700 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">
                {stat.title}
              </p>
              <div
                className={`rounded-xl bg-linear-to-br ${stat.color} p-2.5 text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="my-4">
              <h3 className="text-3xl font-bold text-zinc-100 tracking-tight">
                {stat.value}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{stat.change}</p>
            </div>

            <div
              className={`absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r ${stat.color} opacity-40`}
            />
          </div>
        );
      })}
    </div>
  );
}