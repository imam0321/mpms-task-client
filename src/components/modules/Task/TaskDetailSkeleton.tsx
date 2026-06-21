import React from "react";

export default function TaskDetailSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Skeleton Header */}
      <div className="p-6 border-b border-zinc-900/80 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-14 bg-zinc-800 rounded-full" />
          <div className="h-3 w-20 bg-zinc-800/60 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-zinc-800 rounded-lg mb-2" />
        <div className="h-3 w-1/3 bg-zinc-800/50 rounded" />
      </div>

      {/* Skeleton Status Bar */}
      <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-950/50 flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="h-2 w-16 bg-zinc-800/60 rounded" />
          <div className="h-4 w-24 bg-zinc-800 rounded" />
        </div>
        <div className="h-8 w-28 bg-zinc-800 rounded-lg" />
      </div>

      {/* Skeleton Tabs */}
      <div className="flex border-b border-zinc-900 shrink-0 bg-zinc-950 gap-1 px-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-1 py-3 flex items-center justify-center"
          >
            <div className="h-4 w-12 bg-zinc-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Skeleton Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="space-y-2">
            <div className="h-2 w-12 bg-zinc-800/60 rounded" />
            <div className="h-4 w-24 bg-zinc-800 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-16 bg-zinc-800/60 rounded" />
            <div className="h-4 w-20 bg-zinc-800 rounded" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-2 w-20 bg-zinc-800/60 rounded" />
          <div className="p-4 rounded-xl border border-zinc-900/60 space-y-2">
            <div className="h-3 w-full bg-zinc-800/40 rounded" />
            <div className="h-3 w-5/6 bg-zinc-800/40 rounded" />
            <div className="h-3 w-2/3 bg-zinc-800/40 rounded" />
          </div>
        </div>

        {/* Assignees Skeleton */}
        <div className="space-y-2">
          <div className="h-2 w-24 bg-zinc-800/60 rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-1.5 pr-3 bg-zinc-900/50 border border-zinc-800 rounded-xl"
              >
                <div className="h-6 w-6 rounded-full bg-zinc-800" />
                <div className="space-y-1">
                  <div className="h-3 w-16 bg-zinc-800 rounded" />
                  <div className="h-2 w-10 bg-zinc-800/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtasks Skeleton */}
        <div className="space-y-2">
          <div className="h-2 w-28 bg-zinc-800/60 rounded" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900 bg-zinc-950/40"
              >
                <div className="h-4 w-4 bg-zinc-800 rounded" />
                <div className="h-3 w-2/3 bg-zinc-800/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
