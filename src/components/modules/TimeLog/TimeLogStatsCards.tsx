"use client";

import { BarChart3, Clock } from "lucide-react";

interface TimeLogStatsCardsProps {
  totalProjectHours: number;
  myLoggedHours: number;
}

export default function TimeLogStatsCards({
  totalProjectHours,
  myLoggedHours,
}: TimeLogStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            Total Hours Logged (Project)
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-100">{totalProjectHours} hrs</h2>
        </div>
        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <BarChart3 className="h-6 w-6" />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            My Hours Logged
          </span>
          <h2 className="text-3xl font-extrabold text-indigo-400">{myLoggedHours} hrs</h2>
        </div>
        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Clock className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
