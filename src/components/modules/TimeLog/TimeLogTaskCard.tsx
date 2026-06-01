"use client";

import { Plus, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ITask, ITimeLog, IUser } from "@/types/api.types";
import { TActionResponse } from "@/types";
import TimeLogForm from "./TimeLogForm";
import TimeLogEntryList from "./TimeLogEntryList";

interface TimeLogTaskCardProps {
  task: ITask;
  logs: ITimeLog[];
  isExpanded: boolean;
  isLogging: boolean;
  isLoadingLogs: boolean;
  taskTotalHours: number;
  formAction: (payload: FormData) => void;
  formState: TActionResponse | null;
  isPendingAction: boolean;
  hours: number | "";
  date: string;
  description: string;
  currentUser: IUser;
  onToggleExpand: () => void;
  onOpenLogForm: (e: React.MouseEvent) => void;
  onCancelLogForm: () => void;
  onHoursChange: (value: number | "") => void;
  onDateChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDeleteLog: (logId: string, taskId: string, e: React.MouseEvent) => void;
}

export default function TimeLogTaskCard({
  task,
  logs,
  isExpanded,
  isLogging,
  isLoadingLogs,
  taskTotalHours,
  formAction,
  formState,
  isPendingAction,
  hours,
  date,
  description,
  currentUser,
  onToggleExpand,
  onOpenLogForm,
  onCancelLogForm,
  onHoursChange,
  onDateChange,
  onDescriptionChange,
  onDeleteLog,
}: TimeLogTaskCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md overflow-hidden transition-all duration-200">
      <div
        onClick={onToggleExpand}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/10 transition"
      >
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <ClipboardList className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h5 className="font-bold text-zinc-200 text-sm leading-snug">{task.title}</h5>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500 font-medium">
              <span className="uppercase text-indigo-400 font-bold">{task.status}</span>
              <span>•</span>
              <span>Estimate: {task.estimate ? `${task.estimate}h` : "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <span className="text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-xl">
            {taskTotalHours} hrs logged
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={onOpenLogForm}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 h-8 rounded-lg text-[10px] font-bold px-3.5 cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Log Time
            </Button>
            <button
              type="button"
              className="text-zinc-500 hover:text-zinc-300 p-1 transition cursor-pointer"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isLogging && (
        <TimeLogForm
          taskId={task._id}
          formAction={formAction}
          state={formState}
          isPending={isPendingAction}
          hours={hours}
          date={date}
          description={description}
          onHoursChange={onHoursChange}
          onDateChange={onDateChange}
          onDescriptionChange={onDescriptionChange}
          onCancel={onCancelLogForm}
        />
      )}

      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="px-5 pb-5 pt-3 border-t border-zinc-900 bg-zinc-950/20"
        >
          <TimeLogEntryList
            logs={logs}
            isLoading={isLoadingLogs}
            taskId={task._id}
            currentUser={currentUser}
            onDeleteLog={onDeleteLog}
          />
        </div>
      )}
    </div>
  );
}
