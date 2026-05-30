"use client";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

export default function SearchFilter({
  placeholder = "Search...",
  paramName = "searchTerm",
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || "");
  const debouncedValue = useDebounce(value, 500);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentParam = searchParams.get(paramName) || "";

    if (debouncedValue === currentParam) return;

    if (debouncedValue) {
      params.set(paramName, debouncedValue);
      params.set("page", "1");
    } else {
      params.delete(paramName);
      params.delete("page");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramName, searchParams, router]);

  return (
    <div className="relative flex-1 min-w-0">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
