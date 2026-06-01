"use client";

import { Folder } from "lucide-react";
import { IProject } from "@/types/api.types";

interface TimeLogProjectFilterProps {
  projects: IProject[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export default function TimeLogProjectFilter({
  projects,
  selectedProjectId,
  onProjectChange,
}: TimeLogProjectFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
      <div className="flex items-center gap-3 flex-1">
        <Folder className="h-5 w-5 text-indigo-400 shrink-0" />
        <div className="w-full max-w-xs">
          <select
            value={selectedProjectId}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-xl py-2 px-3 focus:outline-hidden focus:border-zinc-700 cursor-pointer h-9"
          >
            {projects.length === 0 ? (
              <option value="">No projects available</option>
            ) : (
              projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
}
