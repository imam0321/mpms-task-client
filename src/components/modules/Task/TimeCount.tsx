"use client";

import { Clock } from "lucide-react";
import { useTaskTimer } from "@/hooks/useTaskTimer";
import { formatElapsedTime } from "@/lib/taskTimer";

interface TimeCountProps {
  task: {
    _id: string;
    status: string;
    workStartedAt?: string | null;
    taskCompletedTime?: number;
  };
  userId: string;
}

export default function TimeCount({ task, userId }: TimeCountProps) {
  const { display, isRunning, isPaused } = useTaskTimer({
    taskId: task._id,
    userId,
    status: task.status,
    workStartedAt: task.workStartedAt,
  });

  if (!isRunning) {
    if (task.taskCompletedTime && task.taskCompletedTime > 0) {
      return (
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border text-zinc-400 border-zinc-800 bg-zinc-900/50">
          <Clock className="h-3 w-3 shrink-0 text-zinc-500" />
          <span>{formatElapsedTime(task.taskCompletedTime * 1000)}</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
        isPaused
          ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
          : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      }`}
    >
      <Clock className="h-3 w-3 shrink-0" />
      <span>{display}</span>
      {isPaused && <span className="text-[8px] text-zinc-500 uppercase">paused</span>}
    </div>
  );
}
