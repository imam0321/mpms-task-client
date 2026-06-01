"use client";

import { ITask, ITimeLog, IUser } from "@/types/api.types";
import { TActionResponse } from "@/types";
import TimeLogTaskCard from "./TimeLogTaskCard";

interface TimeLogTaskListProps {
  tasks: ITask[];
  taskLogs: Record<string, ITimeLog[]>;
  expandedTaskId: string | null;
  activeLogTaskId: string | null;
  loadingLogs: Record<string, boolean>;
  formAction: (payload: FormData) => void;
  formState: TActionResponse | null;
  isPendingAction: boolean;
  hours: number | "";
  date: string;
  description: string;
  currentUser: IUser;
  onToggleExpand: (taskId: string) => void;
  onOpenLogForm: (taskId: string, e: React.MouseEvent) => void;
  onCancelLogForm: () => void;
  onHoursChange: (value: number | "") => void;
  onDateChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDeleteLog: (logId: string, taskId: string, e: React.MouseEvent) => void;
}

export default function TimeLogTaskList({
  tasks,
  taskLogs,
  expandedTaskId,
  activeLogTaskId,
  loadingLogs,
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
}: TimeLogTaskListProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="px-1">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Active Task Sheet
        </h4>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => {
          const logs = taskLogs[task._id] || [];
          const taskTotalHours = logs.reduce((acc, l) => acc + (l.hours || 0), 0);

          return (
            <TimeLogTaskCard
              key={task._id}
              task={task}
              logs={logs}
              isExpanded={expandedTaskId === task._id}
              isLogging={activeLogTaskId === task._id}
              isLoadingLogs={!!loadingLogs[task._id]}
              taskTotalHours={taskTotalHours}
              formAction={formAction}
              formState={formState}
              isPendingAction={isPendingAction}
              hours={hours}
              date={date}
              description={description}
              currentUser={currentUser}
              onToggleExpand={() => onToggleExpand(task._id)}
              onOpenLogForm={(e) => onOpenLogForm(task._id, e)}
              onCancelLogForm={onCancelLogForm}
              onHoursChange={onHoursChange}
              onDateChange={onDateChange}
              onDescriptionChange={onDescriptionChange}
              onDeleteLog={onDeleteLog}
            />
          );
        })}
      </div>
    </div>
  );
}
