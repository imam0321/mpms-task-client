"use client";

import { Trash2, User } from "lucide-react";
import { ITimeLog, IUser } from "@/types/api.types";
import { formatDate } from "@/lib/formatDate";
import { getLogDescription } from "./timeLog.utils";

interface TimeLogEntryListProps {
  logs: ITimeLog[];
  isLoading: boolean;
  taskId: string;
  currentUser: IUser;
  onDeleteLog: (logId: string, taskId: string, e: React.MouseEvent) => void;
}

export default function TimeLogEntryList({
  logs,
  isLoading,
  taskId,
  currentUser,
  onDeleteLog,
}: TimeLogEntryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 py-2 animate-pulse">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-xl border border-zinc-900 bg-zinc-950/40"
          />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-zinc-600 text-xs py-4 flex items-center gap-1.5 font-medium">
        No logged entries on this task sheet yet.
      </div>
    );
  }

  const currentUserId = currentUser._id || (currentUser as IUser & { id?: string }).id;

  return (
    <div className="space-y-2 mt-1">
      <h6 className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
        Time Registry
      </h6>
      {logs.map((log) => {
        const logUser = typeof log.user === "object" ? log.user : null;
        const logUserId = typeof log.user === "object" ? log.user._id : log.user;
        const canDelete =
          logUserId === currentUserId ||
          currentUser.role === "Admin" ||
          currentUser.role === "Manager";

        return (
          <div
            key={log._id}
            className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/40 text-xs gap-3 hover:border-zinc-850"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                <User className="h-3 w-3 text-zinc-500" />
              </div>
              <div>
                <span className="font-bold text-zinc-200">
                  {logUser?.name || "Team Member"}
                </span>
                {getLogDescription(log) && (
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                    {getLogDescription(log)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="font-extrabold text-zinc-200">{log.hours} hrs</span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">
                  {formatDate(log.date)}
                </span>
              </div>
              {canDelete && (
                <button
                  type="button"
                  onClick={(e) => onDeleteLog(log._id, taskId, e)}
                  className="p-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/30 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
