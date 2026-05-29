"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Network,
  Tags,
  LogIn,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";
import { registerUser } from "@/services/auth/RegisterUser";

export default function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [state, formAction, isPending] = useActionState(
    registerUser,
    null
  );

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Account created successfully!");
      setTimeout(() => router.push("/login"), 1200);
      return;
    }

    if (state.message && state.message !== "Validation failed") {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3.5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3.5">
        {/* Name */}
        <Field className="gap-1.5">
          <FieldLabel className="text-zinc-300 text-xs font-semibold pl-2">
            Full Name
          </FieldLabel>

          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400" />
            <Input
              name="name"
              type="text"
              placeholder="John Doe"
              defaultValue=""
              className="pl-10 h-11 bg-zinc-950/60 border-white/5 focus:border-violet-500 text-white rounded-xl text-sm"
            />
          </div>

          <InputFieldError field="name" state={state} />
        </Field>

        {/* Email */}
        <Field className="gap-1.5">
          <FieldLabel className="text-zinc-300 text-xs font-semibold pl-2">
            Email Address
          </FieldLabel>

          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400" />
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue=""
              className="pl-10 h-11 bg-zinc-950/60 border-white/5 focus:border-violet-500 text-white rounded-xl text-sm"
            />
          </div>

          <InputFieldError field="email" state={state} />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3.5">
        {/* Designation */}
        <Field className="gap-1.5">
          <FieldLabel className="text-zinc-300 text-xs font-semibold pl-2">
            Designation
          </FieldLabel>

          <div className="relative group">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400" />
            <Input
              name="designation"
              type="text"
              placeholder="Software Engineer"
              defaultValue=""
              className="pl-10 h-11 bg-zinc-950/60 border-white/5 focus:border-violet-500 text-white rounded-xl text-sm"
            />
          </div>

          <InputFieldError field="designation" state={state} />
        </Field>

        {/* Department */}
        <Field className="gap-1.5">
          <FieldLabel className="text-zinc-300 text-xs font-semibold pl-2">
            Department
          </FieldLabel>

          <div className="relative group">
            <Network className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400" />
            <Input
              name="department"
              type="text"
              placeholder="Engineering"
              defaultValue=""
              className="pl-10 h-11 bg-zinc-950/60 border-white/5 focus:border-violet-500 text-white rounded-xl text-sm"
            />
          </div>

          <InputFieldError field="department" state={state} />
        </Field>
      </div>

      <Field className="gap-1.5">
        <FieldLabel className="text-zinc-300 text-xs font-semibold pl-2">
          Skills
        </FieldLabel>

        <div className="relative group">
          <Tags className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400" />
          <Input
            name="skills"
            type="text"
            placeholder="React, TypeScript, Node.js"
            defaultValue=""
            className="pl-10 h-11 bg-zinc-950/60 border-white/5 focus:border-violet-500 text-white rounded-xl text-sm"
          />
        </div>

        <InputFieldError field="skills" state={state} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3.5">
        <PasswordInput
          name="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          state={state}
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isPending}
          state={state}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.99] transition-all rounded-xl mt-2"
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Signing up...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Sign Up</span>
          </div>
        )}
      </Button>
    </form>
  );
}