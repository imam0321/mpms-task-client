"use client";

import React, { useState, useEffect, useTransition, useActionState } from "react";
import InputFieldError from "@/components/shared/InputFieldError";
import {
  Clock, Plus, Trash2, Calendar, Loader2, Folder, ClipboardList,
  ChevronDown, ChevronUp, User, FileText, BarChart3, X
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { IProject, ITask, ITimeLog, IUser } from "@/types/api.types";
import { getAllTasks } from "@/services/task/task.service";
import { createTimeLog, deleteTimeLog, getTimeLogsByTask } from "@/services/timelog/timelog.service";
import { formatDate } from "@/lib/formatDate";
import TimeLogSkeleton from "./TimeLogSkeleton";

function getLogDescription(log: ITimeLog): string | undefined {
  return log.description || (log as ITimeLog & { note?: string }).note;
}

interface TimeLogManagementProps {
  projects: IProject[];
  currentUser: IUser;
}

export default function TimeLogManagement({ projects, currentUser }: TimeLogManagementProps) {
  const [isPending, startTransition] = useTransition();

  // Selections
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [taskLogs, setTaskLogs] = useState<Record<string, ITimeLog[]>>({});
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Loadings
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState<Record<string, boolean>>({});

  // Inline Log Form state
  const [activeLogTaskId, setActiveLogTaskId] = useState<string | null>(null);
  const [hours, setHours] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");

  const [state, formAction, isPendingAction] = useActionState(
    createTimeLog,
    null
  );

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success("Time log entry recorded!");
        setActiveLogTaskId(null);
        const taskId =
          (state.formData as { task?: string })?.task ||
          (state.data as { task?: string })?.task ||
          activeLogTaskId;
        if (taskId) {
          fetchTaskLogs(taskId);
        }
      } else {
        if (state.message && state.message !== "Validation failed") {
          toast.error(state.message);
        }
        if (state.formData) {
          setHours(state.formData.hours ? Number(state.formData.hours) : "");
          setDate(state.formData.date || "");
          setDescription(state.formData.description || "");
        }
      }
    }
  }, [state]);

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
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchTaskLogs = async (taskId: string) => {
    setLoadingLogs(prev => ({ ...prev, [taskId]: true }));
    try {
      const res = await getTimeLogsByTask(taskId);
      if (res?.success) {
        setTaskLogs(prev => ({ ...prev, [taskId]: res.data || [] }));
      } else {
        toast.error(res?.message || "Failed to fetch time logs");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setLoadingLogs(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleToggleExpand = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      if (!taskLogs[taskId]) {
        fetchTaskLogs(taskId);
      }
    }
  };

  const handleOpenLogForm = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHours("");
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
    setActiveLogTaskId(taskId);
  };

  // handleLogSubmit removed in favor of Server Action formAction

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
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      handleProjectChange(projects[0]._id);
    }
  }, [projects]);

  // Aggregate stats
  const totalProjectHours = Object.values(taskLogs).flatMap(logs => logs).reduce((acc, l) => acc + (l.hours || 0), 0);
  const myLoggedHours = Object.values(taskLogs)
    .flatMap(logs => logs)
    .filter(l => {
      const uId = typeof l.user === "object" ? l.user._id : l.user;
      const currentId = currentUser._id || (currentUser as any).id;
      return uId === currentId;
    })
    .reduce((acc, l) => acc + (l.hours || 0), 0);

  // Prefetch timelogs when tasks load, to display dashboard numbers accurately
  useEffect(() => {
    if (tasks.length > 0) {
      tasks.forEach((t) => {
        fetchTaskLogs(t._id);
      });
    }
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Top Filter and Select Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3 flex-1">
          <Folder className="h-5 w-5 text-indigo-400 shrink-0" />
          <div className="w-full max-w-xs">
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-xl py-2 px-3 focus:outline-hidden focus:border-zinc-700 cursor-pointer h-9"
            >
              {projects.length === 0 ? (
                <option value="">No projects available</option>
              ) : (
                projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.title}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {selectedProjectId && (
        /* Summary Stat Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Hours Logged (Project)</span>
              <h2 className="text-3xl font-extrabold text-zinc-100">{totalProjectHours} hrs</h2>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">My Hours Logged</span>
              <h2 className="text-3xl font-extrabold text-indigo-400">{myLoggedHours} hrs</h2>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Task List and Inline Logging */}
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
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="px-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Active Task Sheet
            </h4>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isExpanded = expandedTaskId === task._id;
              const isLogging = activeLogTaskId === task._id;
              const logs = taskLogs[task._id] || [];
              const taskTotalHours = logs.reduce((acc, l) => acc + (l.hours || 0), 0);

              return (
                <div
                  key={task._id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md overflow-hidden transition-all duration-200"
                >
                  {/* Task Summary Card */}
                  <div
                    onClick={() => handleToggleExpand(task._id)}
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

                    {/* Right side logs badge & trigger */}
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-xl">
                          {taskTotalHours} hrs logged
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => handleOpenLogForm(task._id, e)}
                          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 h-8 rounded-lg text-[10px] font-bold px-3.5 cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" /> Log Time
                        </Button>
                        <button className="text-zinc-500 hover:text-zinc-300 p-1 transition cursor-pointer">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Logging Form Panel */}
                  {isLogging && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 pb-5 pt-1 border-t border-zinc-900 bg-zinc-950/40"
                    >
                      <form action={formAction} className="space-y-4 max-w-lg mt-3">
                        <input type="hidden" name="task" value={task._id} />
                        <div className="flex items-center justify-between pb-1">
                          <h6 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Log Work Hours</h6>
                          <button
                            type="button"
                            onClick={() => setActiveLogTaskId(null)}
                            className="text-zinc-550 hover:text-zinc-350 transition cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">Hours *</FieldLabel>
                            <FieldContent>
                              <Input
                                type="number"
                                name="hours"
                                placeholder="E.g. 2.5"
                                value={hours}
                                onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
                                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-8.5 text-xs"
                                required
                              />
                              <InputFieldError field="hours" state={state} />
                            </FieldContent>
                          </Field>
                          <Field>
                            <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">Date *</FieldLabel>
                            <FieldContent>
                              <Input
                                type="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-8.5 text-xs cursor-pointer"
                                required
                              />
                              <InputFieldError field="date" state={state} />
                            </FieldContent>
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">Description</FieldLabel>
                          <FieldContent>
                            <Input
                              type="text"
                              name="description"
                              placeholder="Brief summary of tasks done..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-8.5 text-xs"
                            />
                            <InputFieldError field="description" state={state} />
                          </FieldContent>
                        </Field>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={isPendingAction}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-8.5 rounded-xl font-bold px-4 cursor-pointer"
                          >
                            {isPendingAction ? "Submitting..." : "Save Time Entry"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setActiveLogTaskId(null)}
                            variant="outline"
                            className="border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] h-8.5 rounded-xl font-bold px-4 cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Expanded Time Logs Sub-Panel */}
                  {isExpanded && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 pb-5 pt-3 border-t border-zinc-900 bg-zinc-950/20"
                    >
                      {loadingLogs[task._id] ? (
                        <div className="space-y-2 py-2 animate-pulse">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-14 rounded-xl border border-zinc-900 bg-zinc-950/40"
                            />
                          ))}
                        </div>
                      ) : logs.length === 0 ? (
                        <div className="text-zinc-600 text-xs py-4 flex items-center gap-1.5 font-medium">
                          No logged entries on this task sheet yet.
                        </div>
                      ) : (
                        <div className="space-y-2 mt-1">
                          <h6 className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Time Registry</h6>
                          {logs.map((log) => {
                            const logUser = typeof log.user === "object" ? log.user : null;
                            const logUserId = typeof log.user === "object" ? log.user._id : log.user;
                            const currentUserId = currentUser._id || (currentUser as any).id;
                            const canDelete = logUserId === currentUserId || currentUser.role === "Admin" || currentUser.role === "Manager";

                            return (
                              <div
                                key={log._id}
                                className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/40 text-xs gap-3 hover:border-zinc-850"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="h-6 w-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                                    <User className="h-3 w-3 text-zinc-500" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-zinc-200">{logUser?.name || "Team Member"}</span>
                                    {getLogDescription(log) && (
                                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                                        {getLogDescription(log)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <div className="text-right">
                                    <span className="font-extrabold text-zinc-200">{log.hours} hrs</span>
                                    <span className="text-[9px] text-zinc-500 block mt-0.5">{formatDate(log.date)}</span>
                                  </div>
                                  {canDelete && (
                                    <button
                                      onClick={(e) => handleDeleteLog(log._id, task._id, e)}
                                      className="p-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/30 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                                      title="Delete Entry"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
