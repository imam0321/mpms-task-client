"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  state?: any;
}

export default function PasswordInput({
  name,
  label,
  placeholder = "••••••••",
  value,
  onChange,
  disabled,
  state,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field className="gap-1.5">
      <FieldLabel className="text-zinc-300 text-xs font-semibold pl-2">
        {label}
      </FieldLabel>

      <div className="relative group">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />

        <Input
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="pl-10 pr-10 h-11 bg-zinc-950/60 border-white/5 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 text-white placeholder:text-zinc-600 transition-all rounded-xl text-sm"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500/30"
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

      {state && <InputFieldError field={name} state={state} />}
    </Field>
  );
}