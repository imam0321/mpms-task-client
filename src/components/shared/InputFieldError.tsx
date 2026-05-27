"use client";

import { TActionResponse } from "@/types";


interface InputFieldErrorProps {
  state: TActionResponse | null;
  field: string;
}

export default function InputFieldError({ state, field }: InputFieldErrorProps) {
  if (!state || !state.errors) return null;

  const error = state.errors.find((err) => err.field === field);

  if (!error) return null;

  return (
    <p className="text-xs text-rose-500 font-semibold mt-1.5 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
      {error.message}
    </p>
  );
}
