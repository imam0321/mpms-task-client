/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import { toast } from "sonner";
import { IProject } from "@/types/api.types";
import { getProjectProgressReport } from "@/services/reports/reports.service";
import ReportsSkeleton from "./ReportsSkeleton";

interface ProjectReportPanelProps {
  projects: IProject[];
}

export default function ProjectReportPanel({ projects }: ProjectReportPanelProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectReport, setProjectReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjectReport = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const res = await getProjectProgressReport(projId);
      if (res?.success) {
        setProjectReport(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch project report");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectReport(selectedProjectId);
    } else if (projects.length > 0 && projects[0]._id) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [selectedProjectId, projects]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
        <Folder className="h-5 w-5 text-indigo-400 shrink-0" />
        <div className="w-full max-w-xs">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-xl py-2 px-3 focus:outline-hidden focus:border-zinc-700 cursor-pointer h-9"
          >
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && !projectReport ? (
        <ReportsSkeleton />
      ) : !projectReport ? (
        <div className="text-center py-10 text-zinc-600 text-xs">
          No report available for this project.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    Project Completion Ratio
                  </span>
                  <h3 className="text-3xl font-extrabold text-zinc-100">
                    {projectReport.completionRate}%
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  Performance Index
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-850">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                  style={{ width: `${projectReport.completionRate}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Task Allocation Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Todo", count: projectReport.taskCounts.todo, color: "text-zinc-500 bg-zinc-950/50" },
                  { label: "Active", count: projectReport.taskCounts.inProgress, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" },
                  { label: "In Review", count: projectReport.taskCounts.review, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
                  { label: "Completed", count: projectReport.taskCounts.done, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
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

            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-5">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Time Registry Analysis
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                  <span className="text-[9px] font-bold uppercase text-zinc-500">
                    Total Estimates configured
                  </span>
                  <h2 className="text-2xl font-extrabold text-zinc-100 mt-1">
                    {projectReport.hours.estimated} hrs
                  </h2>
                </div>
                <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                  <span className="text-[9px] font-bold uppercase text-indigo-400">
                    Hours logged by team
                  </span>
                  <h2 className="text-2xl font-extrabold text-indigo-400 mt-1">
                    {projectReport.hours.logged} hrs
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-5 h-fit">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Priority Task Profile
            </h4>
            <div className="space-y-4">
              {[
                { priority: "Critical", count: projectReport.priorityBreakdown.Critical, color: "bg-red-500" },
                { priority: "High", count: projectReport.priorityBreakdown.High, color: "bg-amber-500" },
                { priority: "Medium", count: projectReport.priorityBreakdown.Medium, color: "bg-indigo-500" },
                { priority: "Low", count: projectReport.priorityBreakdown.Low, color: "bg-zinc-500" },
              ].map((p, idx) => {
                const total = Object.values(projectReport.priorityBreakdown).reduce(
                  (acc: number, val: unknown) => acc + (val as number),
                  0
                ) as number;
                const percent = total > 0 ? Math.round((p.count / total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-400">{p.priority}</span>
                      <span className="text-zinc-200">
                        {p.count} task{p.count !== 1 ? "s" : ""} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                      <div className={`h-full ${p.color} rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
