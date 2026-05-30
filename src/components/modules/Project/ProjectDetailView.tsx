"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Loader2, Plus, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose
} from "@/components/ui/dialog";

import { IProject, ISprint, ITask, IUser } from "@/types/api.types";
import {
  getSprintsByProject, createSprint, updateSprint, deleteSprint, reorderSprint
} from "@/services/sprint/sprint.service";
import { getTasksBySprint } from "@/services/task/task.service";

import ProjectDetailHeader from "./ProjectDetailHeader";
import SprintSection from "../Sprint/SprintSection";
import CreateTaskDialog from "../Task/CreateTaskDialog";
import TaskDetailPanel from "../Task/TaskDetailPanel";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface ProjectDetailViewProps {
  project: IProject;
  currentUser: IUser;
  backPath: string;
}

export default function ProjectDetailView({
  project,
  currentUser,
  backPath,
}: ProjectDetailViewProps) {
  const [isPending, startTransition] = useTransition();
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [tasksBySprint, setTasksBySprint] = useState<Record<string, ITask[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Sprint Modal States
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<ISprint | null>(null);
  const [sprintTitle, setSprintTitle] = useState("");
  const [sprintStartDate, setSprintStartDate] = useState("");
  const [sprintEndDate, setSprintEndDate] = useState("");
  const [sprintToDelete, setSprintToDelete] = useState<ISprint | null>(null);

  // Task Modal States
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const canManage = currentUser.role === "Admin" || currentUser.role === "Manager";

  // Fetch sprints and tasks
  const fetchSprintsAndTasks = async () => {
    setIsLoading(true);
    try {
      const sprintsRes = await getSprintsByProject(project._id);
      if (sprintsRes?.success) {
        const sortedSprints = (sprintsRes.data || []).sort(
          (a: ISprint, b: ISprint) => (a.order ?? 0) - (b.order ?? 0)
        );
        setSprints(sortedSprints);

        // Fetch tasks for each sprint
        const tasksPromises = sortedSprints.map((sprint: ISprint) =>
          getTasksBySprint(sprint._id)
        );
        const tasksResults = await Promise.all(tasksPromises);

        const newTasksMap: Record<string, ITask[]> = {};
        sortedSprints.forEach((sprint: ISprint, index: number) => {
          const res = tasksResults[index];
          newTasksMap[sprint._id] = res?.success ? res.data || [] : [];
        });
        setTasksBySprint(newTasksMap);
      } else {
        toast.error(sprintsRes?.message || "Failed to load sprints");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to load sprints and tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSprintsAndTasks();
  }, [project._id]);

  // Sprint Form Handlers
  const resetSprintForm = () => {
    setEditingSprint(null);
    setSprintTitle("");
    setSprintStartDate("");
    setSprintEndDate("");
  };

  const handleOpenCreateSprint = () => {
    resetSprintForm();
    setIsSprintOpen(true);
  };

  const handleOpenEditSprint = (sprint: ISprint) => {
    setEditingSprint(sprint);
    setSprintTitle(sprint.title);
    setSprintStartDate(
      sprint.startDate ? new Date(sprint.startDate).toISOString().split("T")[0] : ""
    );
    setSprintEndDate(
      sprint.endDate ? new Date(sprint.endDate).toISOString().split("T")[0] : ""
    );
    setIsSprintOpen(true);
  };

  const handleSprintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintTitle.trim()) {
      toast.error("Sprint title is required.");
      return;
    }

    startTransition(async () => {
      try {
        let res;
        const payload = {
          project: project._id,
          title: sprintTitle.trim(),
          startDate: sprintStartDate || undefined,
          endDate: sprintEndDate || undefined,
        };

        if (editingSprint) {
          res = await updateSprint(editingSprint._id, {
            title: sprintTitle.trim(),
            startDate: sprintStartDate || undefined,
            endDate: sprintEndDate || undefined,
          });
        } else {
          res = await createSprint(payload);
        }

        if (res?.success) {
          toast.success(
            editingSprint ? "Sprint updated successfully!" : "Sprint created successfully!"
          );
          setIsSprintOpen(false);
          resetSprintForm();
          await fetchSprintsAndTasks();
        } else {
          toast.error(res?.message || "Failed to save sprint");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  const handleSprintDelete = () => {
    if (!sprintToDelete) return;
    startTransition(async () => {
      try {
        const res = await deleteSprint(sprintToDelete._id);
        if (res?.success) {
          toast.success("Sprint deleted successfully!");
          setSprintToDelete(null);
          await fetchSprintsAndTasks();
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

    let targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sprints.length) return;

    const targetSprint = sprints[targetIndex];
    const targetOrder = targetSprint.order ?? 0;

    setIsLoading(true);
    try {
      const res = await reorderSprint(sprint._id, targetOrder);
      if (res?.success) {
        toast.success("Sprint order updated!");
        await fetchSprintsAndTasks();
      } else {
        toast.error(res?.message || "Failed to reorder sprint");
        setIsLoading(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred during reorder");
      setIsLoading(false);
    }
  };

  // Task Handlers
  const handleOpenAddTask = (sprintId: string) => {
    setSelectedSprintId(sprintId);
    setIsTaskDialogOpen(true);
  };

  const handleTaskClick = (task: ITask) => {
    setSelectedTaskId(task._id);
    setIsTaskDetailOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Project Details Header Card */}
      <ProjectDetailHeader project={project} backPath={backPath} />

      {/* Sprints & Kanban Board Area */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-100">Project Sprints & Kanban</h2>
          </div>
          {canManage && (
            <Button
              onClick={handleOpenCreateSprint}
              className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer h-9 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create Sprint</span>
            </Button>
          )}
        </div>

        {/* Sprint Listing */}
        {isLoading && sprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/5 border border-zinc-900 rounded-2xl">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
            <span className="text-zinc-500 text-sm font-semibold">Loading sprints & board...</span>
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
                onClick={handleOpenCreateSprint}
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
                onEditSprint={canManage ? handleOpenEditSprint : undefined}
                onDeleteSprint={canManage ? setSprintToDelete : undefined}
                onReorderSprint={canManage ? handleReorderSprint : undefined}
                onAddTask={canManage ? handleOpenAddTask : undefined}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Sprint Dialog */}
      <Dialog
        open={isSprintOpen}
        onOpenChange={(open) => {
          setIsSprintOpen(open);
          if (!open) resetSprintForm();
        }}
      >
        <DialogContent className="w-full sm:max-w-md bg-zinc-950 border border-zinc-900 p-0 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-2xl">
          <DialogHeader className="p-6 border-b border-zinc-900/80">
            <DialogTitle className="text-zinc-100 font-bold text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              {editingSprint ? "Edit Sprint" : "Create New Sprint"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              {editingSprint
                ? "Update the details, title, or timeline for this sprint."
                : "Add a new development sprint to partition project timeline."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSprintSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Sprint Title */}
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                Sprint Title <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  placeholder="e.g. Sprint 1 - Core Auth Setup"
                  value={sprintTitle}
                  onChange={(e) => setSprintTitle(e.target.value)}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  required
                />
              </FieldContent>
            </Field>

            {/* Start & End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Start Date
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="date"
                    value={sprintStartDate}
                    onChange={(e) => setSprintStartDate(e.target.value)}
                    className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  End Date
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="date"
                    value={sprintEndDate}
                    onChange={(e) => setSprintEndDate(e.target.value)}
                    className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                  />
                </FieldContent>
              </Field>
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-900/80 bg-zinc-950/80 flex items-center gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer h-9 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSprintSubmit}
              disabled={isPending}
              className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer h-9 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                </>
              ) : editingSprint ? (
                "Update Sprint"
              ) : (
                "Create Sprint"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
        isPending={isPending}
        zIndex={30}
      />

      {/* Create Task Dialog */}
      <CreateTaskDialog
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        sprints={sprints}
        members={project.members}
        selectedSprintId={selectedSprintId}
        onSuccess={fetchSprintsAndTasks}
      />

      {/* Task Detail slide-out panel */}
      {selectedTaskId && (
        <TaskDetailPanel
          isOpen={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          taskId={selectedTaskId}
          currentUser={currentUser}
          onTaskUpdated={fetchSprintsAndTasks}
        />
      )}
    </div>
  );
}
