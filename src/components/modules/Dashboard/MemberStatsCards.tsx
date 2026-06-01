import { ListTodo, Clock, CheckCircle2 } from "lucide-react";

interface MemberStatsCardsProps {
  totalAssigned: number;
  activeTasks: number;
  highPriorityCount: number;
  hoursToday: number;
  completedTasks: number;
  projectCount: number;
}

export default function MemberStatsCards({
  totalAssigned,
  activeTasks,
  highPriorityCount,
  hoursToday,
  completedTasks,
  projectCount,
}: MemberStatsCardsProps) {
  const stats = [
    {
      title: "My Assigned Tasks",
      value: String(totalAssigned),
      change: `${activeTasks} active · ${highPriorityCount} high priority`,
      icon: ListTodo,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Logged Time Today",
      value: `${hoursToday} hrs`,
      change: "Hours recorded today",
      icon: Clock,
      color: "from-indigo-500 to-violet-500",
    },
    {
      title: "Completed Tasks",
      value: String(completedTasks),
      change: `${projectCount} project${projectCount !== 1 ? "s" : ""} assigned`,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
              <div
                className={`rounded-xl bg-linear-to-br ${stat.color} p-2.5 text-white shadow-lg`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-zinc-100">{stat.value}</h3>
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
