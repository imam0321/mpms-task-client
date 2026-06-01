"use client";

import React, { useState, useEffect, useRef, useActionState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { IProject, IUser, ProjectStatus } from "@/types/api.types";
import { createProject, updateProject } from "@/services/project/project.service";
import InputFieldError from "@/components/shared/InputFieldError";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  project?: IProject;
  onSuccess: () => void;
  allUsers: IUser[];
}

export default function ProjectFormDialog({
  open,
  onClose,
  project,
  onSuccess,
  allUsers,
}: ProjectFormDialogProps) {
  const isEdit = !!project;
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<ProjectStatus>("planned");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      if (project) {
        setStatus(project.status || "planned");
        setSelectedMemberIds(project.members?.map((m) => m._id).filter((id): id is string => !!id) || []);
      } else {
        setStatus("planned");
        setSelectedMemberIds([]);
      }
      setMemberSearchQuery("");
      formRef.current?.reset();
    }
  }, [open, project]);

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateProject.bind(null, project!._id!) : createProject,
    null
  );

  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || (isEdit ? "Project updated successfully" : "Project created successfully"));
      onSuccess();
      onClose();
    } else if (state && !state.success && state.message && state.message !== "Validation failed") {
      toast.error(state.message || "Failed to save project");
    }
  }, [state, onSuccess, onClose, isEdit]);

  const handleClose = () => {
    onClose();
  };

  // Toggle member selection
  const toggleMemberSelection = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Filter users based on search query
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && handleClose()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full sm:max-w-lg bg-zinc-950 border border-zinc-900 p-0 flex flex-col max-h-[90vh] shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200"
      >
        <DialogHeader className="p-6 border-b border-zinc-900/80">
          <DialogTitle className="text-zinc-100 font-bold text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            {isEdit ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">
            {isEdit ? "Update existing project details and members." : "Fill in the details to construct a new project scope."}
          </DialogDescription>
        </DialogHeader>

        <form
          key={isEdit ? `edit-${project._id}` : "create-project-form"}
          ref={formRef}
          action={formAction}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth max-h-[60vh]"
        >
          {/* Hidden inputs to feed status and members list into the automatic form's FormData */}
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="members" value={JSON.stringify(selectedMemberIds)} />

          {/* Project Thumbnail Image */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold ">Thumbnail</FieldLabel>
            <FieldContent>
              <SingleImageUploader
                onChange={() => { }}
                preview={project?.thumbnail || null}
                name="file"
              />
            </FieldContent>
          </Field>

          {/* Title */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider font-bold flex items-center gap-1 text-zinc-300">
              Project Title <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                type="text"
                name="title"
                placeholder="Enter project name"
                defaultValue={project?.title || ""}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                required
              />
              <InputFieldError field="title" state={state} />
            </FieldContent>
          </Field>

          {/* Client */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider  font-bold flex items-center gap-1 text-zinc-300">
              Client Name <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                type="text"
                name="client"
                placeholder="Enter client company or name"
                defaultValue={project?.client || ""}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                required
              />
              <InputFieldError field="client" state={state} />
            </FieldContent>
          </Field>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider font-bold flex items-center gap-1 text-zinc-300">
                Start Date <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  name="startDate"
                  defaultValue={project?.startDate ? project.startDate.split("T")[0] : ""}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                  required
                />
                <InputFieldError field="startDate" state={state} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider font-bold flex items-center gap-1 text-zinc-300">
                End Date <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  name="endDate"
                  defaultValue={project?.endDate ? project.endDate.split("T")[0] : ""}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                  required
                />
                <InputFieldError field="endDate" state={state} />
              </FieldContent>
            </Field>
          </div>

          {/* Budget */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider font-bold text-zinc-300">Budget ($)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="budget"
                placeholder="Enter total budget amount"
                defaultValue={project?.budget ? String(project.budget) : ""}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                min="0"
              />
              <InputFieldError field="budget" state={state} />
            </FieldContent>
          </Field>

          {/* Status Select */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider font-bold text-zinc-300">Status</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-900/30 border border-zinc-800 p-1.5 rounded-xl">
                {(["planned", "active", "completed", "archived"] as ProjectStatus[]).map((statusVal) => (
                  <button
                    key={statusVal}
                    type="button"
                    onClick={() => setStatus(statusVal)}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all duration-150 cursor-pointer ${status === statusVal
                      ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                  >
                    {statusVal}
                  </button>
                ))}
              </div>
            </FieldContent>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider font-bold text-zinc-300">Description</FieldLabel>
            <FieldContent>
              <textarea
                name="description"
                placeholder="Enter project goals, notes, or descriptions..."
                defaultValue={project?.description || ""}
                className="w-full bg-zinc-900/40 border border-zinc-800 text-zinc-200 focus:border-zinc-700 p-2.5 rounded-xl h-24 text-sm outline-none transition-colors scrollbar-thin"
              />
              <InputFieldError field="description" state={state} />
            </FieldContent>
          </Field>

          {/* Members Selection */}
          <Field className="space-y-2">
            <div className="flex justify-between items-center">
              <FieldLabel className="text-xs uppercase tracking-wider font-bold text-zinc-300">Project Members</FieldLabel>
              <span className="text-[10px] text-zinc-400 font-semibold bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-full">
                {selectedMemberIds.length} Selected
              </span>
            </div>
            <FieldContent className="space-y-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="pl-8 bg-zinc-900/30 border-zinc-800 text-xs h-8 rounded-xl"
                />
                {memberSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMemberSearchQuery("")}
                    className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 cursor-pointer border-0 bg-transparent"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Users List Container */}
              <div className="border border-zinc-850 rounded-xl bg-zinc-950/50 max-h-40 overflow-y-auto divide-y divide-zinc-900 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {filteredUsers.length === 0 ? (
                  <div className="text-center p-4 text-xs text-zinc-500">No users found.</div>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = selectedMemberIds.includes(user?._id!);
                    return (
                      <div
                        key={user._id}
                        onClick={() => toggleMemberSelection(user?._id!)}
                        className={`flex items-center gap-3 p-2.5 transition-all duration-150 cursor-pointer hover:bg-zinc-900/30 ${isSelected ? "bg-indigo-950/10 border-l-2 border-l-indigo-500" : ""
                          }`}
                      >
                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-zinc-800 text-transparent"
                            }`}
                        >
                          <span className="text-[10px] font-bold">✓</span>
                        </div>

                        {user.profileImg ? (
                          <img src={user.profileImg} alt={user.name} className="h-8 w-8 rounded-full object-cover border border-zinc-850" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-700/50">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{user.designation || user.role}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </FieldContent>
          </Field>

          {/* Dialog Actions */}
          <div className="pt-2 border-t border-zinc-900 flex items-center gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="w-1/2 border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer h-9 rounded-xl text-xs font-bold bg-transparent hover:bg-zinc-900"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-1/2 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer h-9 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 border-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                isEdit ? "Update Project" : "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
