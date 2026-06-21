"use client";

import { Calendar, CheckSquare, Clock, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { ITask, TaskPriority } from "@/types/api.types";
import { formatDate } from "@/lib/formatDate";
import TimeCount from "./TimeCount";

interface TaskCardProps {
  task: ITask;
  onClick: () => void;
  onEdit?: (task: ITask) => void;
  onDelete?: (task: ITask) => void;
  currentUserId?: string;
}

export default function TaskCard({ task, onClick, onEdit, onDelete, currentUserId }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;

  const priorityBadges: Record<TaskPriority, string> = {
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
    High:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Medium:   "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Low:      "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-950/70 hover:shadow-lg hover:shadow-indigo-500/5 active:translate-y-0 select-none"
    >
      {/* Edit / Delete buttons — visible on hover */}
      {(onEdit || onDelete) && (
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onClick={(e) => e.stopPropagation()} // prevent card click
        >
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Priority badge + estimate */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${priorityBadges[task.priority]}`}
        >
          {task.priority}
        </span>
        <div className="flex items-center gap-2">
          {currentUserId && task.status === "In Progress" && (
            <TimeCount task={task} userId={currentUserId} />
          )}
          {task.estimate && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{task.estimate}h</span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h5 className="font-bold text-zinc-200 group-hover:text-zinc-100 text-sm line-clamp-2 leading-relaxed mb-3">
        {task.title}
      </h5>

      {/* Footer: subtasks · due date · assignees */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-900/60 mt-auto">
        <div className="flex items-center gap-3">
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-[10px] ${
                isOverdue ? "text-red-400 font-semibold" : "text-zinc-500"
              }`}
              title={isOverdue ? "Overdue!" : "Due Date"}
            >
              {isOverdue
                ? <AlertTriangle className="h-3 w-3 shrink-0" />
                : <Calendar className="h-3 w-3 shrink-0" />}
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Assignee avatars */}
        <div className="flex -space-x-1 overflow-hidden shrink-0">
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.slice(0, 3).map((assignee) => (
              <div
                key={assignee._id}
                className="h-5 w-5 rounded-full ring-2 ring-zinc-950 bg-zinc-800 overflow-hidden flex items-center justify-center text-[9px] font-bold text-zinc-300"
                title={assignee.name}
              >
                {assignee.profileImg ? (
                  <img src={assignee.profileImg} alt={assignee.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{assignee.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            ))
          ) : (
            <div
              className="h-5 w-5 rounded-full ring-2 ring-zinc-950 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-600 font-bold"
              title="Unassigned"
            >
              —
            </div>
          )}
          {task.assignees && task.assignees.length > 3 && (
            <div className="h-5 w-5 rounded-full ring-2 ring-zinc-950 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-400 font-bold">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}