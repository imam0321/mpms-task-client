"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/types/api.types";
import { getUserWorkloadReport } from "@/services/reports/reports.service";
import ReportsSkeleton from "./ReportsSkeleton";

interface UserWorkloadPanelProps {
  users: IUser[];
}

export default function UserWorkloadPanel({ users }: UserWorkloadPanelProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userReport, setUserReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserReport = async (usrId: string) => {
    if (!usrId) return;
    setIsLoading(true);
    try {
      const res = await getUserWorkloadReport(usrId);
      if (res?.success) {
        setUserReport(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch workload report");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchUserReport(selectedUserId);
    } else if (users.length > 0 && users[0]._id) {
      setSelectedUserId(users[0]._id);
    }
  }, [selectedUserId, users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
        <Users className="h-5 w-5 text-indigo-400 shrink-0" />
        <div className="w-full max-w-xs">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-xl py-2 px-3 focus:outline-hidden focus:border-zinc-700 cursor-pointer h-9"
          >
            {users.map((usr) => (
              <option key={usr._id} value={usr._id}>
                {usr.name} ({usr.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && !userReport ? (
        <ReportsSkeleton />
      ) : !userReport ? (
        <div className="text-center py-10 text-zinc-600 text-xs">
          No workload report available.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4 h-fit text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start gap-3">
              <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 border border-zinc-700 text-xl shadow-inner">
                {userReport.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-extrabold text-zinc-100 text-base leading-none">
                  {userReport.user.name}
                </h4>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mt-1.5">
                  {userReport.user.role}
                </span>
                <span className="text-xs text-zinc-500 block mt-1">{userReport.user.email}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-900 space-y-3.5 text-xs text-left">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Designation</span>
                <span className="text-zinc-300 font-bold">
                  {userReport.user.designation || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Workload capacity</span>
                <span className="text-zinc-300 font-bold">
                  {userReport.taskCounts.total} Active tickets
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Assigned Task Allocation
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Todo", count: userReport.taskCounts.todo, color: "text-zinc-500 bg-zinc-950/50" },
                  { label: "Active", count: userReport.taskCounts.inProgress, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" },
                  { label: "In Review", count: userReport.taskCounts.review, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
                  { label: "Completed", count: userReport.taskCounts.done, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
                ].map((col, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border border-zinc-900/60 ${col.color} text-center space-y-1`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                      {col.label}
                    </span>
                    <h3 className="text-xl font-extrabold">{col.count}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Assigned Work Hours Investment
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                  <span className="text-[9px] font-bold uppercase text-zinc-500">
                    Estimates configured
                  </span>
                  <h2 className="text-2xl font-extrabold text-zinc-100 mt-1">
                    {userReport.hours.estimated} hrs
                  </h2>
                </div>
                <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                  <span className="text-[9px] font-bold uppercase text-indigo-400">
                    Logged registry hours
                  </span>
                  <h2 className="text-2xl font-extrabold text-indigo-400 mt-1">
                    {userReport.hours.logged} hrs
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
