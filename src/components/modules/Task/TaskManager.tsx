"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IProject, ISprint, ITask, IUser } from "@/types/api.types";
import { deleteTask } from "@/services/task/task.service";
import TaskDetailPanel from "../Task/TaskDetailPanel";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import TaskFormDialog from "./TaskFormDialog";

interface TaskManagerProps {
  project: IProject;
  sprints: ISprint[];
  currentUser: IUser;
  onRefresh: () => Promise<void>;
  onAddTaskRef?: (fn: (sprintId: string) => void) => void;
  onTaskClickRef?: (fn: (task: ITask) => void) => void;
  // NEW: expose edit/delete handlers to parent (ProjectDetailView → SprintManager)
  onEditTaskRef?: (fn: (task: ITask) => void) => void;
  onDeleteTaskRef?: (fn: (task: ITask) => void) => void;
}

export default function TaskManager({
  project,
  sprints,
  currentUser,
  onRefresh,
  onAddTaskRef,
  onTaskClickRef,
  onEditTaskRef,
  onDeleteTaskRef,
}: TaskManagerProps) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const router = useRouter();

  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleOpenAddTask = (sprintId: string) => {
    setEditingTask(null);
    setSelectedSprintId(sprintId);
    setIsTaskDialogOpen(true);
  };

  const handleTaskClick = (task: ITask) => {
    // Members should navigate to the project detail page instead of opening the task panel
    const projectId = typeof task.project === "object" ? task.project._id : task.project;
    if (currentUser.role === "Member") {
      router.push(`/dashboard/member/projects/${projectId}`);
      return;
    }

    setSelectedTaskId(task._id);
    setIsTaskDetailOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    setEditingTask(task);
    setSelectedSprintId(
      typeof task.sprint === "object" ? task.sprint._id : task.sprint
    );
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = (task: ITask) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeletePending(true);
    try {
      const res = await deleteTask(taskToDelete._id);
      if (res?.success) {
        toast.success("Task deleted successfully!");
        setTaskToDelete(null);
        await onRefresh();
      } else {
        toast.error(res?.message || "Failed to delete task");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setIsDeletePending(false);
    }
  };

  // Register all four handlers once on mount
  useEffect(() => {
    onAddTaskRef?.(handleOpenAddTask);
    onTaskClickRef?.(handleTaskClick);
    onEditTaskRef?.(handleEditTask);
    onDeleteTaskRef?.(handleDeleteTask);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/*
        key= forces full remount when switching create ↔ edit:
        - re-initialises useActionState with the correct server action
        - resets all defaultValue inputs to the new task's data
      */}
      <TaskFormDialog
        key={editingTask ? editingTask._id : "create"}
        isOpen={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        sprints={sprints}
        members={project.members}
        selectedSprintId={selectedSprintId}
        editingTask={editingTask}
        onSuccess={onRefresh}
      />

      {selectedTaskId && (
        <TaskDetailPanel
          isOpen={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          taskId={selectedTaskId}
          currentUser={currentUser}
          onTaskUpdated={onRefresh}
        />
      )}

      {/* Task delete confirmation */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-zinc-200">
              &quot;{taskToDelete?.title}&quot;
            </span>
            ? This action cannot be undone.
          </>
        }
        confirmText="Delete Task"
        confirmVariant="destructive"
        isPending={isDeletePending}
        zIndex={40}
      />
    </>
  );
}