import Link from "next/link";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { ITask } from "@/types/api.types";
import {
  getTaskProjectId,
  getTaskProjectTitle,
  taskPriorityStyles,
  taskStatusStyles,
} from "./memberDashboard.utils";

interface MemberTaskQueueProps {
  tasks: ITask[];
}

export default function MemberTaskQueue({ tasks }: MemberTaskQueueProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-200">My Task Queue</h2>
        <Link
          href="/dashboard/member/projects"
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
        >
          Go to Projects <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="h-10 w-10 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">No tasks assigned to you yet.</p>
          <Link
            href="/dashboard/member/projects"
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-2"
          >
            Browse your projects
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const projectId = getTaskProjectId(task);
            const href = projectId
              ? `/dashboard/member/projects/${projectId}`
              : "/dashboard/member/projects";

            return (
              <Link
                key={task._id}
                href={href}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/40 transition-colors hover:bg-zinc-900/40 hover:border-indigo-500/30 cursor-pointer group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                      {task._id.slice(-6).toUpperCase()}
                    </span>
                    <h4 className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 truncate">
                      {task.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-500 pl-0.5">
                    {getTaskProjectTitle(task)}
                  </p>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${taskStatusStyles[task.status]}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${taskPriorityStyles[task.priority]}`}
                  >
                    {task.priority} Priority
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
