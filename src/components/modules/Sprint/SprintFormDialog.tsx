"use client";

import { useEffect, useActionState, useRef } from "react";
import { Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { ISprint } from "@/types/api.types";
import { createSprint, updateSprint } from "@/services/sprint/sprint.service";

interface SprintFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sprint?: ISprint;
  projectId: string;
}

export default function SprintFormDialog({
  open,
  onClose,
  onSuccess,
  sprint,
  projectId,
}: SprintFormDialogProps) {
  const isEdit = !!sprint;
  const [state, formAction, isPending] = useActionState(isEdit ? updateSprint : createSprint, null);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || (isEdit ? "Project updated successfully" : "Project created successfully"));
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message || "Failed to save project");
    }
  }, [state, onSuccess, onClose, isEdit]);

  const handleClose = () => {
    onClose();
  };
  console.log(state)
  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && handleClose()}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="w-full sm:max-w-lg bg-zinc-950 border border-zinc-900 p-0 flex flex-col max-h-[90vh] shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
        <DialogHeader className="p-6 border-b border-zinc-900/80">
          <DialogTitle className="text-zinc-100 font-bold text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            {isEdit ? "Edit Sprint" : "Create New Sprint"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs mt-1">
            {isEdit
              ? "Update the details, title, or timeline for this sprint."
              : "Add a new development sprint to partition project timeline."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex-1 overflow-y-auto p-6 space-y-5">
          {isEdit && (
            <input type="hidden" name="sprintId" value={sprint._id} />
          )}
          {!isEdit && (
            <input type="hidden" name="projectId" value={projectId} />
          )}

          {/* Sprint Title */}
          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
              Sprint Title <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                type="text"
                name="title"
                placeholder="e.g. Sprint 1 - Core Auth Setup"
                defaultValue={sprint?.title ?? ""}
                className={`bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 `}
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
                  name="startDate"
                  defaultValue={
                    sprint?.startDate
                      ? new Date(sprint.startDate).toISOString().split("T")[0]
                      : ""
                  }
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
                  name="endDate"
                  defaultValue={
                    sprint?.endDate
                      ? new Date(sprint.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  className={`bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer`}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="pt-2 border-t border-zinc-900/80 flex items-center gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer h-9 rounded-xl text-xs font-bold"
                onClick={onClose}
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
                "Update Sprint"
              ) : (
                "Create Sprint"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}