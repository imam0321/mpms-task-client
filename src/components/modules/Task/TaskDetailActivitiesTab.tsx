/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatDate } from "@/lib/formatDate";

interface TaskDetailActivitiesTabProps {
  activities: any[];
}

export default function TaskDetailActivitiesTab({
  activities,
}: TaskDetailActivitiesTabProps) {
  return (
    <div className="space-y-6">
      {activities?.length === 0 ? (
        <div className="text-center py-8 text-zinc-600">
          No logs recorded for this task.
        </div>
      ) : (
        <div className="relative border-l-2 border-zinc-900 ml-3 pl-5 space-y-6">
          {activities?.map((act: any) => (
            <div key={act._id} className="relative group">
              {/* Dot marker */}
              <div className="absolute -left-6.75 top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-950 border-2 border-indigo-500 shrink-0" />

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-semibold">
                  {formatDate(act.createdAt)}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-xs text-zinc-300">
                  <span className="font-bold text-zinc-100">
                    {act.user?.name || "System"}
                  </span>
                  <span className="text-indigo-400 font-semibold uppercase text-[9px] border border-indigo-500/10 bg-indigo-500/5 px-1.5 py-0.5 rounded-md self-start sm:self-auto">
                    {act.action}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1 font-medium">
                  {act.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
