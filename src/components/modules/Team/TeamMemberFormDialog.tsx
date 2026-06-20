/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Loader2, Users, Shield, Briefcase, UserCheck } from "lucide-react";
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
import { IUser, UserRole } from "@/types/api.types";
import { addMember, updateMember } from "@/services/user/user.service";

interface TeamMemberFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: IUser;
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  Admin: <Shield className="h-3 w-3" />,
  Manager: <Briefcase className="h-3 w-3" />,
  Member: <UserCheck className="h-3 w-3" />,
};

export default function TeamMemberFormDialog({
  open,
  onClose,
  onSuccess,
  user,
}: TeamMemberFormDialogProps) {
  const isEdit = !!user;
  const formRef = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState<UserRole>("Member");

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateMember : addMember,
    null
  );
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (open) {
      setRole(user?.role ?? "Member");
      formRef.current?.reset();
    }
  }, [open, user]);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      toast.success(
        state.message ||
          (isEdit ? "Member updated successfully!" : "Member added successfully!")
      );
      onSuccess();
      onClose();
    } else if (
      state &&
      !state.success &&
      state.message &&
      state.message !== "Validation failed"
    ) {
      toast.error(state.message || "Failed to save member");
    }
  }, [state, onSuccess, onClose, isEdit]);

  const handleClose = () => {
    onClose();
  };

  const formData = state?.formData as Record<string, string> | undefined;

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && handleClose()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full sm:max-w-lg bg-zinc-950 border border-zinc-900 p-0 flex flex-col max-h-[90vh] shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200"
      >
        <DialogHeader className="p-6 border-b border-zinc-900/80">
          <DialogTitle className="text-zinc-100 font-bold text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            {isEdit ? "Edit Member" : "Add New Member"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs mt-1">
            {isEdit
              ? "Update the member's details, role, or department assignment."
              : "Add a new team member by providing their details and assigning a role."}
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          key={user?._id ?? "new"}
          action={formAction}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth"
        >
          {isEdit && <input type="hidden" name="userId" value={user._id} />}
          <input type="hidden" name="role" value={role} />

          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
              Full Name <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                type="text"
                name="name"
                placeholder="Enter member name"
                defaultValue={formData?.name ?? user?.name ?? ""}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                required
                disabled={isPending}
              />
              <InputFieldError field="name" state={state} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
              Email Address <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                type="email"
                name="email"
                placeholder="Enter email address"
                defaultValue={formData?.email ?? user?.email ?? ""}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                required
                disabled={isPending || isEdit}
              />
              <InputFieldError field="email" state={state} />
            </FieldContent>
          </Field>

          {!isEdit && (
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                Password <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  name="password"
                  placeholder="Set a password"
                  defaultValue={formData?.password ?? ""}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  required
                  disabled={isPending}
                />
                <InputFieldError field="password" state={state} />
              </FieldContent>
            </Field>
          )}

          <Field>
            <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
              Role
            </FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-3 gap-2 bg-zinc-900/30 border border-zinc-800 p-1.5 rounded-xl">
                {(["Admin", "Manager", "Member"] as UserRole[]).map((roleVal) => (
                  <button
                    key={roleVal}
                    type="button"
                    onClick={() => setRole(roleVal)}
                    disabled={isPending}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                      role === roleVal
                        ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {roleIcons[roleVal]}
                    {roleVal}
                  </button>
                ))}
              </div>
              <InputFieldError field="role" state={state} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Designation
              </FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  name="designation"
                  placeholder="e.g. Senior Developer"
                  defaultValue={formData?.designation ?? user?.designation ?? ""}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  disabled={isPending}
                />
                <InputFieldError field="designation" state={state} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Department
              </FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  name="department"
                  placeholder="e.g. Engineering"
                  defaultValue={formData?.department ?? user?.department ?? ""}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  disabled={isPending}
                />
                <InputFieldError field="department" state={state} />
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
                "Update Member"
              ) : (
                "Add Member"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
