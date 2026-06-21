/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { IUser, ISubtask } from "@/types/api.types";
import { formatElapsedTime } from "@/lib/taskTimer";

interface TaskDetailDetailsTabProps {
  task: any;
  isOverdue: boolean;
  handleToggleSubtask: (index: number) => void;
}

export default function TaskDetailDetailsTab({
  task,
  isOverdue,
  handleToggleSubtask,
}: TaskDetailDetailsTabProps) {
  const totalLoggedHours = task.timelogs?.reduce((acc: number, log: any) => acc + (log.hours || 0), 0) || 0;
  const hasTimeSpent = (task.taskCompletedTime && task.taskCompletedTime > 0) || totalLoggedHours > 0;

  return (
    <div className="space-y-6">
      {/* Meta items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 text-xs">
        <div className="space-y-1">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
            Due Date
          </span>
          <div
            className={`flex items-center gap-1 font-semibold ${isOverdue ? "text-red-400" : "text-zinc-200"}`}
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>
              {task.dueDate ? formatDate(task.dueDate) : "No deadline"}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
            Estimate Limit
          </span>
          <div className="flex items-center gap-1 font-semibold text-zinc-200">
            <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>
              {task.estimate ? `${task.estimate} Hours` : "Not estimated"}
            </span>
          </div>
        </div>
        {hasTimeSpent && (
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
              Total Time Spent
            </span>
            <div className="flex items-center gap-1 font-semibold font-mono text-emerald-400">
              <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>
                {task.taskCompletedTime && task.taskCompletedTime > 0
                  ? formatElapsedTime(task.taskCompletedTime * 1000)
                  : formatElapsedTime(totalLoggedHours * 3600 * 1000)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h6 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          Objectives & Context
        </h6>
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/20 p-4 rounded-xl border border-zinc-900/60 whitespace-pre-wrap">
          {task.description || (
            <span className="text-zinc-600 italic">
              No description provided for this task.
            </span>
          )}
        </p>
      </div>

      {/* Assignees list */}
      <div className="space-y-2">
        <h6 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          Assigned Members
        </h6>
        {task.assignees?.length === 0 ? (
          <span className="text-xs text-zinc-500 italic">
            No team members assigned.
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {task.assignees?.map((member: IUser) => (
              <div
                key={member._id}
                className="flex items-center gap-2 p-1.5 pr-3 bg-zinc-900/50 border border-zinc-800 rounded-xl"
              >
                {member.profileImg ? (
                  <Image
                    height={24}
                    width={24}
                    src={member.profileImg}
                    alt={member.name}
                    className="h-6 w-6 rounded-full object-cover border border-zinc-850"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold border border-zinc-800">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-200 leading-none">
                    {member.name}
                  </span>
                  <span className="text-[9px] text-zinc-500 leading-none mt-0.5">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subtask checklist */}
      <div className="space-y-3">
        <h6 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          Subtask Checkpoints
        </h6>
        {task.subtasks?.length === 0 ? (
          <span className="text-xs text-zinc-500 italic block">
            No checklists configured.
          </span>
        ) : (
          <div className="space-y-2">
            {task.subtasks?.map((st: ISubtask, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToggleSubtask(index)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-900 bg-zinc-950/40 text-left hover:border-zinc-800 transition-all duration-150 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={st.isCompleted}
                  onChange={() => {}} // handled by parent button click
                  className="accent-indigo-500 rounded border-zinc-800 h-4 w-4 bg-zinc-900 pointer-events-none cursor-pointer"
                />
                <span
                  className={`text-xs font-medium transition-all ${
                    st.isCompleted
                      ? "text-zinc-500 line-through"
                      : "text-zinc-200"
                  }`}
                >
                  {st.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
