import DashboardHeader from "@/components/modules/Dashboard/DashboardHeader";
import MemberStatsCards from "@/components/modules/Dashboard/MemberStatsCards";
import MemberTaskQueue from "@/components/modules/Dashboard/MemberTaskQueue";
import { getMyProfile } from "@/services/auth/profile.service";
import { getAllProjects } from "@/services/project/project.service";
import { getAllTasks } from "@/services/task/task.service";
import { getMyTimeLogStats } from "@/services/timelog/timelog.service";
import { ITask } from "@/types/api.types";
import { FolderKanban } from "lucide-react";
import Link from "next/link";

export default async function MemberDashboard() {
  const [profileRes, tasksRes, projectsRes, timeStatsRes] = await Promise.all([
    getMyProfile(),
    getAllTasks("limit=100&sort=-updatedAt"),
    getAllProjects("limit=1"),
    getMyTimeLogStats(),
  ]);

  const userName = profileRes?.data?.name?.split(" ")[0] || "there";
  const tasks: ITask[] = tasksRes?.data || [];
  const totalAssigned = tasksRes?.meta?.total ?? tasks.length;
  const activeTasks = tasks.filter((t) => t.status !== "Done").length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const highPriorityCount = tasks.filter(
    (t) => t.priority === "High" || t.priority === "Critical"
  ).length;
  const hoursToday = timeStatsRes?.data?.hoursToday ?? 0;
  const projectCount = projectsRes?.meta?.total ?? 0;

  const recentTasks = tasks
    .filter((t) => t.status !== "Done")
    .slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-1">
      <DashboardHeader
        title={`Welcome, ${userName}`}
        description="Track your assigned tasks, log time entries, and monitor your sprint progress."
      />

      <MemberStatsCards
        totalAssigned={totalAssigned}
        activeTasks={activeTasks}
        highPriorityCount={highPriorityCount}
        hoursToday={hoursToday}
        completedTasks={completedTasks}
        projectCount={projectCount}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MemberTaskQueue tasks={recentTasks.length > 0 ? recentTasks : tasks.slice(0, 8)} />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md space-y-4 h-fit">
          <h3 className="text-lg font-semibold text-zinc-200">Quick Actions</h3>
          <p className="text-xs text-zinc-500">
            Jump to your projects or log time against your assigned tasks.
          </p>
          <div className="space-y-2 pt-1">
            <Link
              href="/dashboard/member/projects"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all"
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-400" />
                My Projects
              </span>
              <span className="text-[10px] text-zinc-500">{projectCount} total</span>
            </Link>
            <Link
              href="/dashboard/member/timelogs"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all"
            >
              <span className="flex items-center gap-2 text-emerald-400">
                Log Time
              </span>
              <span className="text-[10px] text-zinc-500">Time registry</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
