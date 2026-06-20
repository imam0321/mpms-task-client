/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useTransition, useActionState } from "react";
import { Clock, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { IProject, ITask, ITimeLog, IUser } from "@/types/api.types";
import { getAllTasks } from "@/services/task/task.service";
import { createTimeLog, deleteTimeLog, getTimeLogsByTask } from "@/services/timelog/timelog.service";
import TimeLogSkeleton from "./TimeLogSkeleton";
import TimeLogProjectFilter from "./TimeLogProjectFilter";
import TimeLogStatsCards from "./TimeLogStatsCards";
import TimeLogTaskList from "./TimeLogTaskList";

interface TimeLogManagementProps {
  projects: IProject[];
  currentUser: IUser;
}

export default function TimeLogManagement({ projects, currentUser }: TimeLogManagementProps) {
  const [isPending, startTransition] = useTransition();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [taskLogs, setTaskLogs] = useState<Record<string, ITimeLog[]>>({});
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState<Record<string, boolean>>({});

  const [activeLogTaskId, setActiveLogTaskId] = useState<string | null>(null);
  const [hours, setHours] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  const [state, formAction, isPendingAction] = useActionState(createTimeLog, null);

  const fetchTaskLogs = async (taskId: string) => {
    setLoadingLogs((prev) => ({ ...prev, [taskId]: true }));
    try {
      const res = await getTimeLogsByTask(taskId);
      if (res?.success) {
        setTaskLogs((prev) => ({ ...prev, [taskId]: res.data || [] }));
      } else {
        toast.error(res?.message || "Failed to fetch time logs");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoadingLogs((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success("Time log entry recorded!");
        setActiveLogTaskId(null);
        const taskId =
          (state.formData as { task?: string })?.task ||
          (state.data as { task?: string })?.task ||
          activeLogTaskId;
        if (taskId) fetchTaskLogs(taskId);
      } else {
        if (state.message && state.message !== "Validation failed") {
          toast.error(state.message);
        }
        if (state.formData) {
          const fd = state.formData as {
            hours?: string;
            date?: string;
            description?: string;
          };
          setHours(fd.hours ? Number(fd.hours) : "");
          setDate(fd.date || "");
          setDescription(fd.description || "");
        }
      }
    }
  }, [state, activeLogTaskId]);

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setTasks([]);
    setTaskLogs({});
    setExpandedTaskId(null);
    setActiveLogTaskId(null);

    if (!projectId) return;

    setIsLoadingTasks(true);
    try {
      const res = await getAllTasks(`project=${projectId}&limit=100`);
      if (res?.success) {
        setTasks(res.data || []);
      } else {
        toast.error(res?.message || "Failed to fetch project tasks");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleToggleExpand = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      if (!taskLogs[taskId]) fetchTaskLogs(taskId);
    }
  };

  const handleOpenLogForm = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHours("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setActiveLogTaskId(taskId);
  };

  const handleDeleteLog = (logId: string, taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this time entry?")) return;

    startTransition(async () => {
      try {
        const res = await deleteTimeLog(logId);
        if (res?.success) {
          toast.success("Time log entry deleted.");
          fetchTaskLogs(taskId);
        } else {
          toast.error(res?.message || "Failed to delete time log");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
      }
    });
  };

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      handleProjectChange(projects[0]._id);
    }
  }, [projects]);

  useEffect(() => {
    if (tasks.length > 0) {
      tasks.forEach((t) => fetchTaskLogs(t._id));
    }
  }, [tasks]);

  const totalProjectHours = Object.values(taskLogs)
    .flat()
    .reduce((acc, l) => acc + (l.hours || 0), 0);

  const currentUserId = currentUser._id || (currentUser as IUser & { id?: string }).id;
  const myLoggedHours = Object.values(taskLogs)
    .flat()
    .filter((l) => {
      const uId = typeof l.user === "object" ? l.user._id : l.user;
      return uId === currentUserId;
    })
    .reduce((acc, l) => acc + (l.hours || 0), 0);

  return (
    <div className="space-y-6">
      <TimeLogProjectFilter
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectChange={handleProjectChange}
      />

      {selectedProjectId && (
        <TimeLogStatsCards
          totalProjectHours={totalProjectHours}
          myLoggedHours={myLoggedHours}
        />
      )}

      {!selectedProjectId ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center p-6">
          <Clock className="h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">Select Project</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-xs">
            Please choose a project to view task logs or submit work hour records.
          </p>
        </div>
      ) : isLoadingTasks || isPending ? (
        <TimeLogSkeleton />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center p-6">
          <ClipboardList className="h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No Tasks Found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            This project has no active tasks. You can only log work hours against existing tasks.
          </p>
        </div>
      ) : (
        <TimeLogTaskList
          tasks={tasks}
          taskLogs={taskLogs}
          expandedTaskId={expandedTaskId}
          activeLogTaskId={activeLogTaskId}
          loadingLogs={loadingLogs}
          formAction={formAction}
          formState={state}
          isPendingAction={isPendingAction}
          hours={hours}
          date={date}
          description={description}
          currentUser={currentUser}
          onToggleExpand={handleToggleExpand}
          onOpenLogForm={handleOpenLogForm}
          onCancelLogForm={() => setActiveLogTaskId(null)}
          onHoursChange={setHours}
          onDateChange={setDate}
          onDescriptionChange={setDescription}
          onDeleteLog={handleDeleteLog}
        />
      )}
    </div>
  );
}
