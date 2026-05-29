import React from "react";
import { ListTodo, Clock, CheckCircle2, AlertCircle, PlayCircle, PlusCircle, ArrowUpRight } from "lucide-react";

export default function MemberDashboard() {
  const stats = [
    {
      title: "My Assigned Tasks",
      value: "12",
      change: "2 high severity",
      icon: ListTodo,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Logged Time Today",
      value: "6.5 hrs",
      change: "Target: 8.0 hrs",
      icon: Clock,
      color: "from-indigo-500 to-violet-500",
    },
    {
      title: "Completed Tasks",
      value: "45",
      change: "This sprint: 4",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const myTasks = [
    { id: "TSK-201", title: "Integrate Redux state inside auth pipeline", status: "In Progress", priority: "High" },
    { id: "TSK-202", title: "Refactor global CSS and design system styles", status: "Review", priority: "Medium" },
    { id: "TSK-203", title: "Write end-to-end integration tests for sprints", status: "To Do", priority: "Low" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-1">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            My Workspace
          </h1>
          <p className="text-sm text-zinc-400">
            Welcome back! Track your task queues, log time entries, and monitor your sprint progress.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-400 text-sm font-medium w-fit">
          <PlayCircle className="h-4 w-4" />
          <span>Timer: Inactive (Start work)</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-zinc-700/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                <div className={`rounded-xl bg-linear-to-br ${stat.color} p-2.5 text-white shadow-lg`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-zinc-100">{stat.value}</h3>
                <p className="mt-1 text-xs text-zinc-500">{stat.change}</p>
              </div>
              <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r ${stat.color} opacity-40`} />
            </div>
          );
        })}
      </div>

      {/* Assigned Tasks & Logging Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-200">My Task Queue</h2>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors cursor-pointer">
              Go to Task Board <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {myTasks.map((task, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/40 transition-colors hover:bg-zinc-900/40 hover:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{task.id}</span>
                    <h4 className="text-sm font-medium text-zinc-300">{task.title}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    task.status === "In Progress"
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      : task.status === "Review"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}>
                    {task.status}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    task.priority === "High"
                      ? "text-rose-400"
                      : task.priority === "Medium"
                      ? "text-amber-400"
                      : "text-zinc-500"
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200">Log Hours Manually</h3>
            <p className="text-xs text-zinc-500">Log task timings and sprints manually for payroll and tracking.</p>
            <div className="space-y-2 pt-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all duration-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-emerald-400" /> Log Time Entry
                </span>
                <span className="text-[10px] text-zinc-500">Record Hours</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all duration-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" /> Report Impediment
                </span>
                <span className="text-[10px] text-zinc-500">Flag Blockers</span>
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
            <span className="text-xs text-zinc-500">Logged in as Team Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}
