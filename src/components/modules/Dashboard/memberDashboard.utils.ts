import { IProject, ITask, TaskPriority, TaskStatus } from "@/types/api.types";

export function getTaskProjectId(task: ITask): string {
  if (typeof task.project === "object" && task.project?._id) {
    return task.project._id;
  }
  if (typeof task.project === "string") {
    return task.project;
  }
  return "";
}

export function getTaskProjectTitle(task: ITask): string {
  if (typeof task.project === "object" && task.project?.title) {
    return task.project.title;
  }
  return "Project";
}

export const taskStatusStyles: Record<TaskStatus, string> = {
  "To Do": "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  "In Progress": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Review: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export const taskPriorityStyles: Record<TaskPriority, string> = {
  Low: "text-zinc-500",
  Medium: "text-amber-400",
  High: "text-rose-400",
  Critical: "text-red-500",
};
