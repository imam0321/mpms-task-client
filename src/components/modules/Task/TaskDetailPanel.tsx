/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useEffect,
  useTransition,
} from "react";
import {
  Clock,
  Paperclip,
  MessageSquare,
  History,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { IUser } from "@/types/api.types";
import {
  getTaskById,
  updateTask,
  changeTaskStatus,
  approveTask,
} from "@/services/task/task.service";
import { useTaskTimer } from "@/hooks/useTaskTimer";

// Sub-components
import TaskDetailSkeleton from "./TaskDetailSkeleton";
import TaskDetailQuickStatusBar from "./TaskDetailQuickStatusBar";
import TaskDetailDetailsTab from "./TaskDetailDetailsTab";
import TaskDetailCommentsTab from "./TaskDetailCommentsTab";
import TaskDetailTimeLogsTab from "./TaskDetailTimeLogsTab";
import TaskDetailAttachmentsTab from "./TaskDetailAttachmentsTab";
import TaskDetailActivitiesTab from "./TaskDetailActivitiesTab";

interface TaskDetailPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  currentUser: IUser;
  onTaskUpdated: () => void;
}

type TabType =
  | "details"
  | "comments"
  | "timelogs"
  | "attachments"
  | "activities";

export default function TaskDetailPanel({
  isOpen,
  onOpenChange,
  taskId,
  currentUser,
  onTaskUpdated,
}: TaskDetailPanelProps) {
  const [isPending, startTransition] = useTransition();

  const [task, setTask] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("details");

  const {
    display: timerDisplay,
    isRunning: isTimerRunning,
    isPaused: isTimerPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    pauseAndGetSeconds,
  } = useTaskTimer({
    taskId: taskId || "",
    userId: currentUser._id || "",
    status: task?.status ?? "To Do",
    workStartedAt: task?.workStartedAt,
  });

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const res = await getTaskById(taskId);
      if (res?.success) {
        setTask(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch task details");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
      setActiveTab("details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, taskId]);

  const handleStatusChange = (status: string) => {
    if (!task) return;

    const isSubmittingWork =
      task.status === "In Progress" &&
      (status === "Review" || status === "Done");
    const completedSeconds = isSubmittingWork
      ? pauseAndGetSeconds()
      : undefined;

    startTransition(async () => {
      try {
        const res = await changeTaskStatus(task._id, status, completedSeconds);
        if (res?.success) {
          if (status === "In Progress") {
            startTimer();
          }
          toast.success(`Status changed to ${status}`);
          fetchTaskDetails();
          onTaskUpdated();
        } else {
          toast.error(res?.message || "Failed to update status");
        }
      } catch (err: any) {
        toast.error(err?.message || "Access denied / Status change failed");
      }
    });
  };

  const handleApprove = () => {
    if (!task) return;
    startTransition(async () => {
      try {
        const res = await approveTask(task._id);
        if (res?.success) {
          toast.success("Task approved and marked as Done!");
          fetchTaskDetails();
          onTaskUpdated();
        } else {
          toast.error(res?.message || "Failed to approve task");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  const handleToggleSubtask = (index: number) => {
    if (!task) return;
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      isCompleted: !updatedSubtasks[index].isCompleted,
    };

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("subtasks", JSON.stringify(updatedSubtasks));
        const res = await updateTask(task._id, formData);
        if (res?.success) {
          setTask((prev: any) => ({ ...prev, subtasks: updatedSubtasks }));
          onTaskUpdated();
        } else {
          toast.error(res?.message || "Failed to update subtask");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  const canManage =
    currentUser.role === "Admin" || currentUser.role === "Manager";

  const isOverdue =
    task?.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";
  const priorityBadges = {
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
    High: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Medium: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-2xl! bg-zinc-950 border-l border-zinc-900 p-0 flex flex-col h-full shadow-2xl overflow-hidden focus:outline-hidden"
      >
        <SheetTitle className="sr-only">
          Task Details: {task?.title || "Loading"}
        </SheetTitle>
        {isLoading && !task ? (
          <TaskDetailSkeleton />
        ) : !task ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <FileText className="h-10 w-10 mb-3 text-zinc-700" />
            <span className="text-sm font-semibold">Task not found</span>
            <span className="text-xs text-zinc-600 mt-1">
              This task may have been deleted or is unavailable.
            </span>
          </div>
        ) : (
          <>
            {/* Sheet Header */}
            <SheetHeader className="p-6 border-b border-zinc-900/80 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${priorityBadges[task.priority as keyof typeof priorityBadges]}`}
                >
                  {task.priority}
                </span>
                <span className="text-xs text-zinc-500">
                  in{" "}
                  {typeof task.sprint === "object"
                    ? task.sprint.title
                    : "Sprint"}
                </span>
              </div>
              <div className="text-zinc-100 font-extrabold text-xl leading-snug">
                {task.title}
              </div>
              <SheetDescription className="text-zinc-500 text-xs mt-1">
                Project:{" "}
                {typeof task.project === "object" ? task.project.title : "N/A"}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Status Control Bar */}
            <TaskDetailQuickStatusBar
              task={task}
              isPending={isPending}
              canManage={canManage}
              timerDisplay={timerDisplay}
              isTimerRunning={isTimerRunning}
              isTimerPaused={isTimerPaused}
              resumeTimer={resumeTimer}
              pauseTimer={pauseTimer}
              handleStatusChange={handleStatusChange}
              handleApprove={handleApprove}
            />

            {/* Tab navigation */}
            <div className="flex border-b border-zinc-900 shrink-0 bg-zinc-950">
              {(
                [
                  {
                    id: "details",
                    label: "Details",
                    icon: <FileText className="h-3.5 w-3.5" />,
                  },
                  {
                    id: "comments",
                    label: `Comments (${task.comments?.length || 0})`,
                    icon: <MessageSquare className="h-3.5 w-3.5" />,
                  },
                  {
                    id: "timelogs",
                    label: "Time Logs",
                    icon: <Clock className="h-3.5 w-3.5" />,
                  },
                  {
                    id: "attachments",
                    label: `Files (${task.attachments?.length || 0})`,
                    icon: <Paperclip className="h-3.5 w-3.5" />,
                  },
                  {
                    id: "activities",
                    label: "Activities",
                    icon: <History className="h-3.5 w-3.5" />,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/2"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Active Tab Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {activeTab === "details" && (
                <TaskDetailDetailsTab
                  task={task}
                  isOverdue={isOverdue}
                  handleToggleSubtask={handleToggleSubtask}
                />
              )}

              {activeTab === "comments" && (
                <TaskDetailCommentsTab
                  taskId={task._id}
                  comments={task.comments}
                  currentUser={currentUser}
                  fetchTaskDetails={fetchTaskDetails}
                />
              )}

              {activeTab === "timelogs" && (
                <TaskDetailTimeLogsTab
                  taskId={task._id}
                  timelogs={task.timelogs}
                  fetchTaskDetails={fetchTaskDetails}
                />
              )}

              {activeTab === "attachments" && (
                <TaskDetailAttachmentsTab
                  taskId={task._id}
                  attachments={task.attachments}
                  fetchTaskDetails={fetchTaskDetails}
                />
              )}

              {activeTab === "activities" && (
                <TaskDetailActivitiesTab activities={task.activities} />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
