/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useActionState, useRef } from "react";
import { Plus, X, Users, Loader2, ListTodo, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ISprint, IUser, ITask, ISubtask } from "@/types/api.types";
import { createTask, updateTask } from "@/services/task/task.service";
import Image from "next/image";

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sprints: ISprint[];
  members: IUser[];
  selectedSprintId?: string;
  editingTask?: ITask | null;
  onSuccess: () => void;
}

export default function TaskFormDialog({
  isOpen,
  onOpenChange,
  sprints,
  members,
  selectedSprintId,
  editingTask,
  onSuccess,
}: TaskFormDialogProps) {
  const isEdit = !!editingTask;

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateTask : createTask,
    null
  );

  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [reviewRequired, setReviewRequired] = useState(false);

  // Reset controlled state on open / task change
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setSelectedAssigneeIds(
          editingTask.assignees
            .map((a) => a._id)
            .filter((id): id is string => typeof id === "string")
        );
        setSubtasks(editingTask.subtasks || []);
        setReviewRequired(editingTask.reviewRequired || false);
      } else {
        setSelectedAssigneeIds([]);
        setSubtasks([]);
        setReviewRequired(false);
      }
      setNewSubtaskTitle("");
    }
  }, [isOpen, editingTask]);

  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (!state) return;
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      onSuccess();
      onOpenChange(false);
    } else if (state.message && state.message !== "Validation failed") {
      toast.error(state.message);
    }
  }, [state, onOpenChange, onSuccess]);

  const handleToggleAssignee = (id: string) => {
    setSelectedAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { title: newSubtaskTitle.trim(), isCompleted: false },
    ]);
    setNewSubtaskTitle("");
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="w-full sm:max-w-xl bg-zinc-950 border border-zinc-900 p-0 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 border-b border-zinc-900/80">
          <DialogTitle className="text-zinc-100 font-bold text-lg flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-indigo-400" />
            {isEdit ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs mt-1">
            {isEdit
              ? "Update your task details, adjust status, checklist, or assignees."
              : "Create a new task with checklist items and assign it to sprint members."}
          </DialogDescription>
        </DialogHeader>

        <form
          action={formAction}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth max-h-[55vh]"
        >
          {isEdit && (
            <input type="hidden" name="taskId" value={editingTask!._id} />
          )}

          <input type="hidden" name="subtasks" value={JSON.stringify(subtasks)} />
          <input type="hidden" name="reviewRequired" value={String(reviewRequired)} />
          {selectedAssigneeIds.map((id) => (
            <input key={id} type="hidden" name="assignees" value={id} />
          ))}

          {/* Sprint */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
              Sprint Target <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <select
                name="sprint"
                defaultValue={
                  isEdit
                    ? typeof editingTask!.sprint === "object"
                      ? editingTask!.sprint._id
                      : editingTask!.sprint
                    : selectedSprintId || sprints[0]?._id || ""
                }
                className={`w-full bg-zinc-900/40 border border-zinc-800 text-zinc-200 text-sm rounded-xl py-2 px-3 focus:outline-hidden focus:border-zinc-700 cursor-pointer h-9`}
                required
              >
                <option value="">Select sprint</option>
                {sprints.map((sp) => (
                  <option key={sp._id} value={sp._id}>
                    Sprint {sp.sprintNumber}: {sp.title}
                  </option>
                ))}
              </select>
              <InputFieldError field="sprint" state={state} />
            </FieldContent>
          </Field>

          {/* Title */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
              Task Title <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                type="text"
                name="title"
                placeholder="Enter task name"
                defaultValue={editingTask?.title ?? ""}
                className={`bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9`}
                required
              />
              <InputFieldError field="title" state={state} />
            </FieldContent>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
              Description
            </FieldLabel>
            <FieldContent>
              <textarea
                name="description"
                placeholder="Describe the objective, scope, and expected results..."
                defaultValue={editingTask?.description ?? ""}
                rows={3}
                className="w-full bg-zinc-900/40 border border-zinc-800 text-zinc-200 text-sm rounded-xl p-3 focus:outline-hidden focus:border-zinc-700 placeholder-zinc-600"
              />
              <InputFieldError field="description" state={state} />
            </FieldContent>
          </Field>

          {/* Priority · Estimate · Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Priority
              </FieldLabel>
              <FieldContent>
                <select
                  name="priority"
                  defaultValue={editingTask?.priority ?? "Medium"}
                  className="w-full bg-zinc-900/40 border border-zinc-800 text-zinc-200 text-sm rounded-xl py-2 px-3 focus:outline-hidden focus:border-zinc-700 cursor-pointer h-9"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <InputFieldError field="priority" state={state} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                Estimate <span className="text-[10px] text-zinc-600">(Hrs)</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="estimate"
                  placeholder="e.g. 8"
                  defaultValue={editingTask?.estimate ?? ""}
                  min={0}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                />
                <InputFieldError field="estimate" state={state} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Due Date
              </FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  name="dueDate"
                  defaultValue={
                    editingTask?.dueDate
                      ? new Date(editingTask.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                />
                <InputFieldError field="dueDate" state={state} />
              </FieldContent>
            </Field>
          </div>

          {/* Review Required Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200">
                  Require Manager Approval
                </span>
                <span className="text-[10px] text-zinc-500">
                  Requires a manager to mark this task complete in Review status.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReviewRequired((prev) => !prev)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-200 ${reviewRequired ? "bg-indigo-600" : "bg-zinc-800"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${reviewRequired ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          {/* Assignees */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Assign Team Members
            </FieldLabel>
            <FieldContent>
              {members.length === 0 ? (
                <span className="text-xs text-zinc-600">No project members available</span>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-35 overflow-y-auto p-2 border border-zinc-900/80 bg-zinc-950/20 rounded-xl scrollbar-thin">
                  {members.map((member) => {
                    const isSelected = selectedAssigneeIds.includes(member?._id as string);
                    return (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() => handleToggleAssignee(member?._id as string)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl text-left border cursor-pointer transition-all duration-150 ${isSelected
                          ? "bg-indigo-600/10 border-indigo-500/30 text-zinc-200"
                          : "bg-zinc-900/20 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                          }`}
                      >
                        {member.profileImg ? (
                          <Image
                            src={member.profileImg}
                            alt={member.name}
                            className="h-6 w-6 rounded-full object-cover border border-zinc-800"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center font-semibold text-[9px] border border-zinc-700/50">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate leading-none mb-0.5">
                            {member.name}
                          </p>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold leading-none">
                            {member.role}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </FieldContent>
          </Field>

          {/* Subtasks */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
              <ListTodo className="h-3.5 w-3.5" />
              Subtasks Checklist
            </FieldLabel>
            <FieldContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a step to accomplish..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                />
                <Button
                  type="button"
                  onClick={handleAddSubtask}
                  className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer h-9 px-3 rounded-xl shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-1.5 p-2 rounded-xl border border-zinc-900/80 bg-zinc-950/20 max-h-35 overflow-y-auto scrollbar-thin">
                  {subtasks.map((st, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-1.5 px-2.5 rounded-lg border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 transition-all duration-150"
                    >
                      <span className="text-xs text-zinc-300 truncate">{st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(idx)}
                        className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FieldContent>
          </Field>

          {/* Footer — inside <form> so type="submit" works */}
          <div className="pt-2 border-t border-zinc-900/80 flex items-center gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer h-9 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-1/2 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer h-9 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}