"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SlidersHorizontal, Check } from "lucide-react";

interface SelectFilterProps {
  paramName: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

export default function SelectFilter({
  paramName,
  placeholder,
  options,
}: SelectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [mobileOpen, setMobileOpen] = useState(false);

  const currentValue = searchParams.get(paramName) || "All";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All") {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });

    setMobileOpen(false);
  };

  return (
    <div className="relative">
      {/* Desktop Select */}
      <div className="hidden md:block">
        <Select
          value={currentValue}
          onValueChange={handleChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className="w-52">
            <SelectItem value="All">All</SelectItem>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Button */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden flex items-center gap-2 h-9 px-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-300"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-xs truncate">
          {options.find((o) => o.value === currentValue)?.label || "All"}
        </span>
      </button>

      {/* Mobile Bottom List */}
      {mobileOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-2">
          {[
            { label: "All", value: "All" },
            ...options,
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange(option.value)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${currentValue === option.value
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
            >
              {option.label}

              {currentValue === option.value && (
                <Check className="h-3.5 w-3.5 text-indigo-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}