/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useTransition, useActionState, useRef } from "react";
import InputFieldError from "@/components/shared/InputFieldError";
import {
  Clock,
  Calendar,
  Trash2,
  Paperclip,
  MessageSquare,
  History,
  FileText,
  UserCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { IUser, ISubtask } from "@/types/api.types";
import { formatDate } from "@/lib/formatDate";
import {
  getTaskById,
  updateTask,
  changeTaskStatus,
  approveTask,
  addComment,
  addAttachment,
  logTime,
  deleteComment,
} from "@/services/task/task.service";
import Image from "next/image";
import Link from "next/link";

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

  // Input states
  const [newComment, setNewComment] = useState("");
  const [logHours, setLogHours] = useState<number | "">("");
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [logNote, setLogNote] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [logTimeState, logTimeAction, isLoggingTimePending] = useActionState(
    logTime,
    null
  );

  const prevLogTimeStateRef = useRef(logTimeState);

  useEffect(() => {
    if (logTimeState === prevLogTimeStateRef.current) return;
    prevLogTimeStateRef.current = logTimeState;

    if (logTimeState) {
      if (logTimeState.success) {
        setLogHours("");
        setLogNote("");
        toast.success("Time logged successfully!");
        fetchTaskDetails();
      } else {
        if (logTimeState.message && logTimeState.message !== "Validation failed") {
          toast.error(logTimeState.message);
        }
        if (logTimeState.formData) {
          setLogHours(logTimeState.formData.hours ? Number(logTimeState.formData.hours) : "");
          setLogDate(logTimeState.formData.date || "");
          setLogNote(logTimeState.formData.note || "");
        }
      }
    }
  }, [logTimeState]);

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
  }, [isOpen, taskId]);

  const handleStatusChange = (status: string) => {
    if (!task) return;
    startTransition(async () => {
      try {
        const res = await changeTaskStatus(task._id, status);
        if (res?.success) {
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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    startTransition(async () => {
      try {
        const res = await addComment(task._id, { comment: newComment.trim() });
        if (res?.success) {
          setNewComment("");
          toast.success("Comment added!");
          fetchTaskDetails();
        } else {
          toast.error(res?.message || "Failed to add comment");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      try {
        const res = await deleteComment(commentId);
        if (res?.success) {
          toast.success("Comment deleted successfully!");
          fetchTaskDetails();
        } else {
          toast.error(res?.message || "Failed to delete comment");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  // handleLogTime removed in favor of Server Action logTimeAction

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentFile || !task) return;

    const formData = new FormData();
    formData.append("file", attachmentFile);

    startTransition(async () => {
      try {
        const res = await addAttachment(task._id, formData);
        if (res?.success) {
          setAttachmentFile(null);
          // Reset file input value
          const fileInput = document.getElementById(
            "task-attachment-upload",
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";

          toast.success("Attachment uploaded!");
          fetchTaskDetails();
        } else {
          toast.error(res?.message || "Failed to upload attachment");
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
        className="w-full sm:max-w-2xl lg:!max-w-2xl bg-zinc-950 border-l border-zinc-900 p-0 flex flex-col h-full shadow-2xl overflow-hidden focus:outline-hidden"
      >
        <SheetTitle className="sr-only">
          Task Details: {task?.title || "Loading"}
        </SheetTitle>
        {isLoading && !task ? (
          <div className="flex flex-col h-full animate-pulse">
            {/* Skeleton Header */}
            <div className="p-6 border-b border-zinc-900/80 shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-14 bg-zinc-800 rounded-full" />
                <div className="h-3 w-20 bg-zinc-800/60 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-zinc-800 rounded-lg mb-2" />
              <div className="h-3 w-1/3 bg-zinc-800/50 rounded" />
            </div>

            {/* Skeleton Status Bar */}
            <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-950/50 flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-1">
                <div className="h-2 w-16 bg-zinc-800/60 rounded" />
                <div className="h-4 w-24 bg-zinc-800 rounded" />
              </div>
              <div className="h-8 w-28 bg-zinc-800 rounded-lg" />
            </div>

            {/* Skeleton Tabs */}
            <div className="flex border-b border-zinc-900 shrink-0 bg-zinc-950 gap-1 px-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 py-3 flex items-center justify-center"
                >
                  <div className="h-4 w-12 bg-zinc-800/50 rounded" />
                </div>
              ))}
            </div>

            {/* Skeleton Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                <div className="space-y-2">
                  <div className="h-2 w-12 bg-zinc-800/60 rounded" />
                  <div className="h-4 w-24 bg-zinc-800 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-zinc-800/60 rounded" />
                  <div className="h-4 w-20 bg-zinc-800 rounded" />
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-2 w-20 bg-zinc-800/60 rounded" />
                <div className="p-4 rounded-xl border border-zinc-900/60 space-y-2">
                  <div className="h-3 w-full bg-zinc-800/40 rounded" />
                  <div className="h-3 w-5/6 bg-zinc-800/40 rounded" />
                  <div className="h-3 w-2/3 bg-zinc-800/40 rounded" />
                </div>
              </div>

              {/* Assignees Skeleton */}
              <div className="space-y-2">
                <div className="h-2 w-24 bg-zinc-800/60 rounded" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-1.5 pr-3 bg-zinc-900/50 border border-zinc-800 rounded-xl"
                    >
                      <div className="h-6 w-6 rounded-full bg-zinc-800" />
                      <div className="space-y-1">
                        <div className="h-3 w-16 bg-zinc-800 rounded" />
                        <div className="h-2 w-10 bg-zinc-800/50 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtasks Skeleton */}
              <div className="space-y-2">
                <div className="h-2 w-28 bg-zinc-800/60 rounded" />
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900 bg-zinc-950/40"
                    >
                      <div className="h-4 w-4 bg-zinc-800 rounded" />
                      <div className="h-3 w-2/3 bg-zinc-800/40 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
            <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  Current Status
                </span>
                <span className="text-xs font-extrabold uppercase text-indigo-400">
                  {task.status}
                </span>
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
              {/* DETAILS PANEL */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Meta items Grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 text-xs">
                    <div className="space-y-1">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
                        Due Date
                      </span>
                      <div
                        className={`flex items-center gap-1 font-semibold ${isOverdue ? "text-red-400" : "text-zinc-200"}`}
                      >
                        <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <span>
                          {task.dueDate
                            ? formatDate(task.dueDate)
                            : "No deadline"}
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
                          {task.estimate
                            ? `${task.estimate} Hours`
                            : "Not estimated"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h6 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      Objectives & Context
                    </h6>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/20 p-4 rounded-xl border border-zinc-900/60 white-space-pre-wrap">
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
              )}

              {/* COMMENTS PANEL */}
              {activeTab === "comments" && (
                <div className="space-y-6">
                  {/* Add comment box */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Share updates or ask a question..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                    />
                    <Button
                      type="submit"
                      disabled={isPending || !newComment.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 rounded-xl px-4 cursor-pointer"
                    >
                      Post
                    </Button>
                  </form>

                  {/* Comments feed */}
                  {task.comments?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
                      <MessageSquare className="h-7 w-7 mb-2 text-zinc-700" />
                      <span className="text-xs font-semibold">
                        No discussions yet
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        Start the conversation by posting an update.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {task.comments?.map((c: any) => (
                        <div
                          key={c._id}
                          className="flex gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:bg-zinc-950/40 transition-all"
                        >
                          {c.author?.profileImg ? (
                            <Image
                              height={32}
                              width={32}
                              src={c.author.profileImg}
                              alt={c.author.name}
                              className="h-8 w-8 rounded-full object-cover border border-zinc-800 shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-700/50 text-zinc-300 shrink-0">
                              {c.author?.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-200">
                                  {c.author?.name}
                                </span>
                                <span className="text-[9px] text-zinc-500">
                                  {formatDate(c.createdAt)}
                                </span>
                              </div>
                              {(c.author?._id === currentUser?._id ||
                                currentUser?.role === "Admin" ||
                                currentUser?.role === "Manager") && (
                                <button
                                  onClick={() => handleDeleteComment(c._id)}
                                  disabled={isPending}
                                  className="text-zinc-500 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                  title="Delete comment"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide block mb-1">
                              {c.author?.role}
                            </span>
                            <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                              {c.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TIMELOGS PANEL */}
              {activeTab === "timelogs" && (
                <div className="space-y-6">
                  {/* Log time form */}
                  <form
                    action={logTimeAction}
                    className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4"
                  >
                    <input type="hidden" name="taskId" value={task._id} />
                    <h6 className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      Log Work Hours
                    </h6>
                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
                          Hours *
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            type="number"
                            name="hours"
                            placeholder="Hours, e.g. 2.5"
                            value={logHours}
                            onChange={(e) =>
                              setLogHours(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                              )
                            }
                            className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                            required
                          />
                          <InputFieldError field="hours" state={logTimeState} />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
                          Date *
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            type="date"
                            name="date"
                            value={logDate}
                            onChange={(e) => setLogDate(e.target.value)}
                            className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                            required
                          />
                          <InputFieldError field="date" state={logTimeState} />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
                        Log Description
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          type="text"
                          name="note"
                          placeholder="What did you work on? E.g. Refactored controllers"
                          value={logNote}
                          onChange={(e) => setLogNote(e.target.value)}
                          className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                        />
                        <InputFieldError field="note" state={logTimeState} />
                      </FieldContent>
                    </Field>
                    <Button
                      type="submit"
                      disabled={isLoggingTimePending || !logHours}
                      className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
                    >
                      {isLoggingTimePending ? "Logging..." : "Log Time Entry"}
                    </Button>
                  </form>

                  {/* Logs list */}
                  {task.timelogs?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
                      <Clock className="h-7 w-7 mb-2 text-zinc-700" />
                      <span className="text-xs font-semibold">
                        No time entries
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        Work hours have not been recorded on this task yet.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs px-1 text-zinc-400 font-semibold uppercase tracking-wider">
                        <span>Time Card History</span>
                        <span className="text-emerald-400">
                          Total:{" "}
                          {task.timelogs?.reduce(
                            (acc: number, log: any) => acc + (log.hours || 0),
                            0,
                          )}{" "}
                          hrs
                        </span>
                      </div>

                      <div className="space-y-2">
                        {task.timelogs?.map((log: any) => (
                          <div
                            key={log._id}
                            className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/20 text-xs gap-3"
                          >
                            <div className="flex items-center gap-3">
                              {log.user?.profileImg ? (
                                <Image
                                  height={28}
                                  width={28}
                                  src={log.user.profileImg}
                                  alt={log.user.name}
                                  className="h-7 w-7 rounded-full object-cover border border-zinc-800"
                                />
                              ) : (
                                <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold border border-zinc-750">
                                  {log.user?.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h6 className="font-bold text-zinc-200 leading-none">
                                  {log.user?.name}
                                </h6>
                                <span className="text-[10px] text-zinc-500 leading-none block mt-1">
                                  {log.description || "No description"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-extrabold text-zinc-200 block">
                                {log.hours} hrs
                              </span>
                              <span className="text-[9px] text-zinc-500 block mt-1">
                                {formatDate(log.date)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ATTACHMENTS PANEL */}
              {activeTab === "attachments" && (
                <div className="space-y-6">
                  {/* File upload form */}
                  <form
                    onSubmit={handleAddAttachment}
                    className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4"
                  >
                    <h6 className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Paperclip className="h-4 w-4 text-indigo-400" />
                      Upload File Attachment
                    </h6>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        id="task-attachment-upload"
                        onChange={(e) =>
                          setAttachmentFile(e.target.files?.[0] || null)
                        }
                        className="w-full bg-zinc-900/30 border border-zinc-800 text-zinc-300 text-xs rounded-xl p-2 cursor-pointer focus:outline-hidden focus:border-zinc-700"
                        required
                      />
                      <span className="text-[9px] text-zinc-500">
                        PNG, JPG, PDF, DOCX (Max 10MB)
                      </span>
                    </div>
                    <Button
                      type="submit"
                      disabled={isPending || !attachmentFile}
                      className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
                    >
                      Upload File
                    </Button>
                  </form>

                  {/* Attachments List */}
                  {task.attachments?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
                      <Paperclip className="h-7 w-7 mb-2 text-zinc-700" />
                      <span className="text-xs font-semibold">
                        No file assets
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        Drag-and-drop or select files to link with this task.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {task.attachments?.map((url: string, index: number) => {
                        const filename = url.substring(
                          url.lastIndexOf("/") + 1,
                        );
                        return (
                          <Link
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition-all text-xs text-zinc-300"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                              <span className="truncate max-w-70 font-semibold">
                                {filename}
                              </span>
                            </div>
                            <span className="text-[9px] text-indigo-400 font-extrabold uppercase shrink-0 hover:underline">
                              View
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVITIES PANEL */}
              {activeTab === "activities" && (
                <div className="space-y-6">
                  {task.activities?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600">
                      No logs recorded for this task.
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-zinc-900 ml-3 pl-5 space-y-6">
                      {task.activities?.map((act: any) => (
                        <div key={act._id} className="relative group">
                          {/* Dot marker */}
                          <div className="absolute -left-6.75 top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-950 border-2 border-indigo-500 shrink-0" />

                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-500 font-semibold">
                              {formatDate(act.createdAt)}
                            </span>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-xs text-zinc-300">
                              <span className="font-bold text-zinc-100">
                                {act.user?.name || "System"}
                              </span>
                              <span className="text-indigo-400 font-semibold uppercase text-[9px] border border-indigo-500/10 bg-indigo-500/5 px-1.5 py-0.5 rounded-md self-start sm:self-auto">
                                {act.action}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed mt-1 font-medium">
                              {act.details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
