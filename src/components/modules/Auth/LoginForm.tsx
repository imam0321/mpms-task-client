/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/loginUser";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const demoUsers = {
  admin: {
    email: "admin@gmail.com",
    password: "123456789",
  },
  member: {
    email: "imam.hossain0321@gmail.com",
    password: "123456789",
  },
  manager: {
    email: "moderator@gmail.com",
    password: "123456789",
  },
};

export default function LoginForm({
  redirectPath,
}: {
  redirectPath?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, isPending] = useActionState(loginUser, null);
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (
        !state.success &&
        state.message &&
        state.message !== "Validation failed"
      ) {
        toast.error(state.message);
      }

      if (state.formData) {
        setEmail((state.formData.email as string) || "");
        setPassword((state.formData.password as string) || "");
      }
    }
  }, [state]);

  const fillDemoUser = (role: "admin" | "manager" | "member") => {
    setEmail(demoUsers[role].email);
    setPassword(demoUsers[role].password);
  };

  return (
    <form action={formAction} className="space-y-2">
      <div className="space-y-1">
        <div className="grid grid-cols-3 gap-2.5">
          {(["admin", "manager", "member"] as const).map((role) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              onClick={() => fillDemoUser(role)}
              className="text-xs font-semibold bg-zinc-900/50 border-white/5 hover:border-violet-500/50 hover:bg-violet-500/10 text-zinc-400 hover:text-white transition-all duration-200 rounded-lg py-1.5 active:scale-95"
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative flex py-1 items-center">
        <div className="grow border-t border-white/5"></div>

        <span className="shrink mx-4 text-zinc-600 text-xs font-medium">
          or credentials
        </span>

        <div className="grow border-t border-white/5"></div>
      </div>

      <input type="hidden" name="redirectPath" value={redirectPath || ""} />

      <Field>
        <FieldLabel
          className="text-zinc-300 text-sm font-medium pl-2"
        >
          Email Address
        </FieldLabel>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />

          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-11 h-12 bg-zinc-950/60 border-white/5 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 text-white placeholder:text-zinc-600 transition-all rounded-xl"
            disabled={isPending}
          />
        </div>

        <InputFieldError field="email" state={state} />
      </Field>

      <Field>
        <FieldLabel
          className="text-zinc-300 text-sm font-medium pl-2"
        >
          Password
        </FieldLabel>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />

          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-11 pr-12 h-12 bg-zinc-950/60 border-white/5 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 text-white placeholder:text-zinc-600 transition-all rounded-xl"
            disabled={isPending}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500/30"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <InputFieldError field="password" state={state} />
      </Field>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.99] transition-all rounded-xl mt-2"
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </div>
        )}
      </Button>
    </form>
  );
}