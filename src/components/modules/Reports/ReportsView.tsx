"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3, Folder, Users, Layers, Clock, TrendingUp, AlertTriangle,
  UserCheck, ClipboardList, CheckCircle2, ChevronRight, HelpCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IProject, IUser } from "@/types/api.types";
import {
  getOverviewReport, getProjectProgressReport, getUserWorkloadReport
} from "@/services/reports/reports.service";

interface ReportsViewProps {
  projects: IProject[];
  users: IUser[];
}

type TabType = "overview" | "projects" | "users";

export default function ReportsView({ projects, users }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Overview report state
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  // Project progress report state
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectReport, setProjectReport] = useState<any | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  // User workload report state
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userReport, setUserReport] = useState<any | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Fetch Overview Report
  const fetchOverview = async () => {
    setIsLoadingOverview(true);
    try {
      const res = await getOverviewReport();
      if (res?.success) {
        setOverviewData(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch overview metrics");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setIsLoadingOverview(false);
    }
  };

  // Fetch Project Progress Report
  const fetchProjectReport = async (projId: string) => {
    if (!projId) return;
    setIsLoadingProject(true);
    try {
      const res = await getProjectProgressReport(projId);
      if (res?.success) {
        setProjectReport(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch project report");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setIsLoadingProject(false);
    }
  };

  // Fetch User Workload Report
  const fetchUserReport = async (usrId: string) => {
    if (!usrId) return;
    setIsLoadingUser(true);
    try {
      const res = await getUserWorkloadReport(usrId);
      if (res?.success) {
        setUserReport(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch workload report");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectReport(selectedProjectId);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [selectedProjectId, projects]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserReport(selectedUserId);
    } else if (users.length > 0) {
      setSelectedUserId(users[0]._id);
    }
  }, [selectedUserId, users]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tab controls */}
      <div className="flex border border-zinc-800 rounded-2xl p-1 bg-zinc-950/20 backdrop-blur-md max-w-md w-full">
        {([
          { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
          { id: "projects", label: "Projects", icon: <Folder className="h-4 w-4" /> },
          { id: "users", label: "Resource Workload", icon: <Users className="h-4 w-4" /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW PANEL */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {isLoadingOverview && !overviewData ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
              <span className="text-zinc-500 text-sm font-semibold">Generating metrics overview...</span>
            </div>
          ) : !overviewData ? (
            <div className="text-center py-10 text-zinc-600 text-xs">
              No overview data available.
            </div>
          ) : (
            <>
              {/* System Stat Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Projects", value: overviewData.systemStats.totalProjects, icon: <Folder className="h-5 w-5 text-indigo-400" /> },
                  { label: "Sprints Completed", value: overviewData.systemStats.totalSprints, icon: <Layers className="h-5 w-5 text-indigo-400" /> },
                  { label: "Task Tickets", value: overviewData.systemStats.totalTasks, icon: <ClipboardList className="h-5 w-5 text-indigo-400" /> },
                  { label: "Time Logged", value: `${overviewData.systemStats.totalLoggedHours}h`, icon: <Clock className="h-5 w-5 text-indigo-400" /> },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md flex items-center justify-between hover:border-zinc-700/60 transition"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{stat.label}</span>
                      <h2 className="text-2xl font-extrabold text-zinc-100">{stat.value}</h2>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects Summary Performance */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <h4 className="text-sm font-extrabold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                    Projects Progress Index
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-zinc-500 font-bold border-b border-zinc-900 pb-3">
                        <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[10px]">Project Name</th>
                        <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[10px]">Tasks Completed</th>
                        <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[10px]">Time Logged</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] w-48 text-right">Completion index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60">
                      {overviewData.projectsSummary?.map((p: any) => (
                        <tr key={p.id} className="hover:bg-zinc-900/10 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/admin/projects/${p.id}`)}>
                          <td className="py-3.5 pr-4 font-semibold text-zinc-200">{p.title}</td>
                          <td className="py-3.5 pr-4 text-zinc-400 font-medium">{p.completedTasks} / {p.totalTasks}</td>
                          <td className="py-3.5 pr-4 text-zinc-400 font-medium">{p.loggedHours} hrs</td>
                          <td className="py-3.5 text-right w-48">
                            <div className="flex items-center justify-end gap-3">
                              <span className="font-bold text-zinc-300">{p.completionRate}%</span>
                              <div className="w-24 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                                <div
                                  className="h-full bg-linear-to-r from-indigo-500 to-violet-600 rounded-full"
                                  style={{ width: `${p.completionRate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* PROJECTS PERFORMANCE PANEL */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          {/* Project selector dropdown */}
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

          {isLoadingProject && !projectReport ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
              <span className="text-zinc-500 text-sm font-semibold">Generating project progress report...</span>
            </div>
          ) : !projectReport ? (
            <div className="text-center py-10 text-zinc-600 text-xs">
              No report available for this project.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Performance stat card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Visual completion meter */}
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Project Completion Ratio</span>
                      <h3 className="text-3xl font-extrabold text-zinc-100">{projectReport.completionRate}%</h3>
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

                {/* Task Breakdown stats */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Task Allocation Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Todo", count: projectReport.taskCounts.todo, color: "text-zinc-500 bg-zinc-950/50" },
                      { label: "Active", count: projectReport.taskCounts.inProgress, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" },
                      { label: "In Review", count: projectReport.taskCounts.review, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
                      { label: "Completed", count: projectReport.taskCounts.done, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
                    ].map((col, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border border-zinc-900/60 ${col.color} text-center space-y-1`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{col.label}</span>
                        <h3 className="text-xl font-extrabold">{col.count}</h3>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimate vs Logged hours */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-5">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Time Registry Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                      <span className="text-[9px] font-bold uppercase text-zinc-500">Total Estimates configured</span>
                      <h2 className="text-2xl font-extrabold text-zinc-100 mt-1">{projectReport.hours.estimated} hrs</h2>
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                      <span className="text-[9px] font-bold uppercase text-indigo-400">Hours logged by team</span>
                      <h2 className="text-2xl font-extrabold text-indigo-400 mt-1">{projectReport.hours.logged} hrs</h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Breakdown sidebar card */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-5 h-fit">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Priority Task Profile</h4>
                <div className="space-y-4">
                  {[
                    { priority: "Critical", count: projectReport.priorityBreakdown.Critical, color: "bg-red-500" },
                    { priority: "High", count: projectReport.priorityBreakdown.High, color: "bg-amber-500" },
                    { priority: "Medium", count: projectReport.priorityBreakdown.Medium, color: "bg-indigo-500" },
                    { priority: "Low", count: projectReport.priorityBreakdown.Low, color: "bg-zinc-500" },
                  ].map((p, idx) => {
                    const total = Object.values(projectReport.priorityBreakdown).reduce((acc: number, val: any) => acc + val, 0) as number;
                    const percent = total > 0 ? Math.round((p.count / total) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">{p.priority}</span>
                          <span className="text-zinc-200">{p.count} task{p.count !== 1 ? "s" : ""} ({percent}%)</span>
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
      )}

      {/* RESOURCE WORKLOAD PANEL */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* User selector dropdown */}
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

          {isLoadingUser && !userReport ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
              <span className="text-zinc-500 text-sm font-semibold">Generating resource workload report...</span>
            </div>
          ) : !userReport ? (
            <div className="text-center py-10 text-zinc-600 text-xs">
              No workload report available.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Bio and Stats cards */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4 h-fit text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start gap-3">
                  <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 border border-zinc-700 text-xl shadow-inner">
                    {userReport.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-zinc-100 text-base leading-none">{userReport.user.name}</h4>
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mt-1.5">{userReport.user.role}</span>
                    <span className="text-xs text-zinc-500 block mt-1">{userReport.user.email}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 space-y-3.5 text-xs text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-semibold">Designation</span>
                    <span className="text-zinc-300 font-bold">{userReport.user.designation || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-semibold">Workload capacity</span>
                    <span className="text-zinc-300 font-bold">{userReport.taskCounts.total} Active tickets</span>
                  </div>
                </div>
              </div>

              {/* Right Performance breakdowns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Breakdown stats */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Assigned Task Allocation</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Todo", count: userReport.taskCounts.todo, color: "text-zinc-500 bg-zinc-950/50" },
                      { label: "Active", count: userReport.taskCounts.inProgress, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" },
                      { label: "In Review", count: userReport.taskCounts.review, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
                      { label: "Completed", count: userReport.taskCounts.done, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
                    ].map((col, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border border-zinc-900/60 ${col.color} text-center space-y-1`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{col.label}</span>
                        <h3 className="text-xl font-extrabold">{col.count}</h3>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Hours registry */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md space-y-4">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Assigned Work Hours Investment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                      <span className="text-[9px] font-bold uppercase text-zinc-500">Estimates configured</span>
                      <h2 className="text-2xl font-extrabold text-zinc-100 mt-1">{userReport.hours.estimated} hrs</h2>
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-950/40 text-center">
                      <span className="text-[9px] font-bold uppercase text-indigo-400">Logged registry hours</span>
                      <h2 className="text-2xl font-extrabold text-indigo-400 mt-1">{userReport.hours.logged} hrs</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
