"use client";

import { X } from "lucide-react";
import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { TActionResponse } from "@/types";

interface TimeLogFormProps {
  taskId: string;
  formAction: (payload: FormData) => void;
  state: TActionResponse | null;
  isPending: boolean;
  hours: number | "";
  date: string;
  description: string;
  onHoursChange: (value: number | "") => void;
  onDateChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCancel: () => void;
}

export default function TimeLogForm({
  taskId,
  formAction,
  state,
  isPending,
  hours,
  date,
  description,
  onHoursChange,
  onDateChange,
  onDescriptionChange,
  onCancel,
}: TimeLogFormProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="px-5 pb-5 pt-1 border-t border-zinc-900 bg-zinc-950/40"
    >
      <form action={formAction} className="space-y-4 max-w-lg mt-3">
        <input type="hidden" name="task" value={taskId} />
        <div className="flex items-center justify-between pb-1">
          <h6 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            Log Work Hours
          </h6>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
              Hours *
            </FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="hours"
                placeholder="E.g. 2.5"
                value={hours}
                onChange={(e) =>
                  onHoursChange(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-8.5 text-xs"
                required
              />
              <InputFieldError field="hours" state={state} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
              Date *
            </FieldLabel>
            <FieldContent>
              <Input
                type="date"
                name="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-8.5 text-xs cursor-pointer"
                required
              />
              <InputFieldError field="date" state={state} />
            </FieldContent>
          </Field>
        </div>
        <Field>
          <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
            Description
          </FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="description"
              placeholder="Brief summary of tasks done..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-8.5 text-xs"
            />
            <InputFieldError field="description" state={state} />
          </FieldContent>
        </Field>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-8.5 rounded-xl font-bold px-4 cursor-pointer"
          >
            {isPending ? "Submitting..." : "Save Time Entry"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] h-8.5 rounded-xl font-bold px-4 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
