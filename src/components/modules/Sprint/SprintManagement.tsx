"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IProject, ISprint, ITask } from "@/types/api.types";
import { deleteSprint, reorderSprint } from "@/services/sprint/sprint.service";
import SprintSection from "../Sprint/SprintSection";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SprintFormDialog from "./SprintFormDialog";

interface SprintManagerProps {
  project: IProject;
  canManage: boolean;
  sprints: ISprint[];
  tasksBySprint: Record<string, ITask[]>;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onAddTask: (sprintId: string) => void;
  onTaskClick: (task: ITask) => void;
  onEditTask?: (task: ITask) => void;
  onDeleteTask?: (task: ITask) => void;
}

export default function SprintManager({
  project,
  canManage,
  sprints,
  tasksBySprint,
  onRefresh,
  onAddTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}: SprintManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState<ISprint | undefined>(undefined);
  const [sprintToDelete, setSprintToDelete] = useState<ISprint | null>(null);

  const handleOpenCreate = () => {
    setEditingSprint(undefined);
    setOpenModal(true);
  };

  const handleOpenEdit = (sprint: ISprint) => {
    setEditingSprint(sprint);
    setOpenModal(true);
  };

  const handleSprintDelete = () => {
    if (!sprintToDelete) return;
    startTransition(async () => {
      try {
        const res = await deleteSprint(sprintToDelete._id);
        if (res?.success) {
          toast.success("Sprint deleted successfully!");
          setSprintToDelete(null);
          await onRefresh();
        } else {
          toast.error(res?.message || "Failed to delete sprint");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred during deletion");
      }
    });
  };

  const handleReorderSprint = async (sprint: ISprint, direction: "up" | "down") => {
    const currentIndex = sprints.findIndex((s) => s._id === sprint._id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sprints.length) return;

    const targetOrder = sprints[targetIndex].order ?? 0;

    try {
      const res = await reorderSprint(sprint._id, targetOrder);
      if (res?.success) {
        toast.success("Sprint order updated!");
        await onRefresh();
      } else {
        toast.error(res?.message || "Failed to reorder sprint");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred during reorder");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-zinc-100">Project Sprints & Kanban</h2>
        </div>
        {canManage && (
          <Button
            onClick={handleOpenCreate}
            className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer h-9 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Create Sprint</span>
          </Button>
        )}
      </div>

      {/* Sprint listing */}
      {isPending && sprints.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-32 bg-zinc-800 rounded" />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-20 bg-zinc-800 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : sprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-850 bg-zinc-950/20 text-center p-6">
          <Layers className="h-10 w-10 text-zinc-700 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No active sprints in this project</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            Sprints allow you to partition your project objectives chronologically and drive delivery.
          </p>
          {canManage && (
            <Button
              onClick={handleOpenCreate}
              variant="outline"
              className="mt-4 border-zinc-800 hover:border-zinc-700 text-zinc-300 cursor-pointer rounded-xl text-xs font-bold"
            >
              Create First Sprint
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          {sprints.map((sprint, index) => (
            <SprintSection
              key={sprint._id}
              sprint={sprint}
              tasks={tasksBySprint[sprint._id] || []}
              index={index}
              totalSprints={sprints.length}
              onEditSprint={canManage ? handleOpenEdit : undefined}
              onDeleteSprint={canManage ? setSprintToDelete : undefined}
              onReorderSprint={canManage ? handleReorderSprint : undefined}
              onAddTask={canManage ? onAddTask : undefined}
              onTaskClick={onTaskClick}
              onEditTask={canManage ? onEditTask : undefined}
              onDeleteTask={canManage ? onDeleteTask : undefined}
            />
          ))}
        </div>
      )}

      {/* SprintFormDialog */}
      <SprintFormDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={onRefresh}
        sprint={editingSprint}
        projectId={project._id}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!sprintToDelete}
        onClose={() => setSprintToDelete(null)}
        onConfirm={handleSprintDelete}
        title="Delete Sprint"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-zinc-200">
              &quot;{sprintToDelete?.title}&quot;
            </span>
            ? This will permanently remove the sprint. All tasks inside this sprint will be unassigned.
          </>
        }
        confirmText="Delete Sprint"
        confirmVariant="destructive"
        isPending={isPending}
        zIndex={30}
      />
    </div>
  );
}