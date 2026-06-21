/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Clock, Play, Pause, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatElapsedTime } from "@/lib/taskTimer";

interface TaskDetailQuickStatusBarProps {
  task: any;
  isPending: boolean;
  canManage: boolean;
  timerDisplay: string;
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  resumeTimer: () => void;
  pauseTimer: () => void;
  handleStatusChange: (status: string) => void;
  handleApprove: () => void;
}

export default function TaskDetailQuickStatusBar({
  task,
  isPending,
  canManage,
  timerDisplay,
  isTimerRunning,
  isTimerPaused,
  resumeTimer,
  pauseTimer,
  handleStatusChange,
  handleApprove,
}: TaskDetailQuickStatusBarProps) {
  return (
    <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            Current Status
          </span>
          <span className="text-xs font-extrabold uppercase text-indigo-400">
            {task.status}
          </span>
        </div>
        {(isTimerRunning || (task.taskCompletedTime && task.taskCompletedTime > 0)) && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Work Timer
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 font-mono text-sm font-bold ${!isTimerRunning
                  ? "text-zinc-400"
                  : isTimerPaused
                    ? "text-amber-400"
                    : "text-emerald-400"
                  }`}
              >
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isTimerRunning
                    ? timerDisplay
                    : formatElapsedTime((task.taskCompletedTime || 0) * 1000)}
                </span>
              </div>
              {isTimerRunning && (
                <Button
                  onClick={isTimerPaused ? resumeTimer : pauseTimer}
                  disabled={isPending}
                  variant="outline"
                  size="sm"
                  className="h-4 px-2 text-[10px] font-bold border-zinc-800 text-zinc-300 hover:text-zinc-100 cursor-pointer gap-1"
                >
                  {isTimerPaused ? (
                    <>
                      <Play className="h-3 w-3" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3" /> Pause
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status workflow triggers */}
      <div className="flex items-center gap-2 flex-wrap">
        {task.status !== "Done" && (
          <>
            {task.status === "To Do" && (
              <Button
                onClick={() => handleStatusChange("In Progress")}
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-8 rounded-lg font-bold px-3 cursor-pointer"
              >
                Start Work
              </Button>
            )}
            {task.status === "In Progress" && (
              <Button
                onClick={() => handleStatusChange("Review")}
                disabled={isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] h-8 rounded-lg font-bold px-3 cursor-pointer"
              >
                Submit for Review
              </Button>
            )}
            {task.status === "Review" && (
              <>
                {task.reviewRequired && canManage ? (
                  <Button
                    onClick={handleApprove}
                    disabled={isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-8 rounded-lg font-bold px-3 cursor-pointer flex items-center gap-1"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Approve & Done
                  </Button>
                ) : task.reviewRequired ? (
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                    Pending Manager Approval
                  </span>
                ) : (
                  <Button
                    onClick={() => handleStatusChange("Done")}
                    disabled={isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-8 rounded-lg font-bold px-3 cursor-pointer"
                  >
                    Mark as Done
                  </Button>
                )}
                {canManage && (
                  <Button
                    onClick={() => handleStatusChange("In Progress")}
                    disabled={isPending}
                    variant="outline"
                    className="border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] h-8 rounded-lg font-bold px-3 cursor-pointer"
                  >
                    Request Re-work
                  </Button>
                )}
              </>
            )}
          </>
        )}

        {task.status === "Done" && (
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            Completed
          </span>
        )}
      </div>
    </div>
  );
}
