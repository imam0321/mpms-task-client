"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Briefcase,
  Network,
  Tags,
  Loader2,
  Shield,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InputFieldError from "@/components/shared/InputFieldError";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IUser, UserRole } from "@/types/api.types";
import { updateProfile } from "@/services/auth/profile.service";

interface ProfileFormProps {
  user: IUser;
}

const roleBadges: Record<UserRole, string> = {
  Admin: "bg-red-500/10 text-red-400 border-red-500/20",
  Manager: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Member: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [state, formAction, isPending] = useActionState(updateProfile, null);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || "Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
      return;
    }

    if (state && !state.success && state.message && state.message !== "Validation failed") {
      toast.error(state.message);
    }
  }, [state, router]);

  const formData = state?.formData as Record<string, string> | undefined;
  const skillsValue =
    formData?.skills ?? (user.skills?.length ? user.skills.join(", ") : "");

  const handleCancelEdit = () => {
    setIsEditing(false);
    formRef.current?.reset();
  };

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.profileImg ? (
              <Image
                src={user.profileImg}
                alt={user.name}
                width={72}
                height={72}
                unoptimized
                className="h-[72px] w-[72px] rounded-full object-cover border-2 border-zinc-800"
              />
            ) : (
              <div className="h-[72px] w-[72px] rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-200 border-2 border-zinc-700/50">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-zinc-100">{user.name}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${roleBadges[user.role]}`}
              >
                <Shield className="h-3 w-3" />
                {user.role}
              </span>
            </div>
          </div>

          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white h-9 rounded-xl text-xs font-bold shrink-0"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Profile
            </Button>
          )}
        </div>

        {!isEditing ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Designation
              </span>
              <p className="text-sm text-zinc-200">{user.designation || "—"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Department
              </span>
              <p className="text-sm text-zinc-200">{user.department || "—"}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Skills
              </span>
              <p className="text-sm text-zinc-200">
                {user.skills?.length ? user.skills.join(", ") : "—"}
              </p>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            key={user._id}
            action={formAction}
            className="p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">Edit your profile</h3>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Profile Photo
              </FieldLabel>
              <FieldContent>
                <SingleImageUploader
                  name="file"
                  preview={user.profileImg}
                  onChange={() => {}}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    defaultValue={formData?.name ?? user.name}
                    className="pl-10 bg-zinc-900/40 border-zinc-800 text-zinc-200 rounded-xl h-9"
                    required
                    disabled={isPending}
                  />
                </div>
                <InputFieldError field="name" state={state} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Email Address
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    type="email"
                    value={user.email}
                    readOnly
                    disabled
                    className="pl-10 bg-zinc-900/20 border-zinc-800 text-zinc-500 rounded-xl h-9 cursor-not-allowed"
                  />
                </div>
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Designation
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      name="designation"
                      placeholder="e.g. Senior Developer"
                      defaultValue={formData?.designation ?? user.designation ?? ""}
                      className="pl-10 bg-zinc-900/40 border-zinc-800 text-zinc-200 rounded-xl h-9"
                      disabled={isPending}
                    />
                  </div>
                  <InputFieldError field="designation" state={state} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Department
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Network className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      name="department"
                      placeholder="e.g. Engineering"
                      defaultValue={formData?.department ?? user.department ?? ""}
                      className="pl-10 bg-zinc-900/40 border-zinc-800 text-zinc-200 rounded-xl h-9"
                      disabled={isPending}
                    />
                  </div>
                  <InputFieldError field="department" state={state} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Skills
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Tags className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    type="text"
                    name="skills"
                    placeholder="React, TypeScript, Node.js"
                    defaultValue={skillsValue}
                    className="pl-10 bg-zinc-900/40 border-zinc-800 text-zinc-200 rounded-xl h-9"
                    disabled={isPending}
                  />
                </div>
                <InputFieldError field="skills" state={state} />
              </FieldContent>
            </Field>

            <div className="pt-2 flex items-center gap-3 justify-end border-t border-zinc-900/80">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isPending}
                className="border-zinc-800 text-zinc-400 hover:text-zinc-200 h-9 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white h-9 px-6 rounded-xl text-xs font-bold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
