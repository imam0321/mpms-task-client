import React from "react";
import { FolderKanban, Activity, ListTodo, Clock, Users, ArrowUpRight, TrendingUp } from "lucide-react";

export default function ManagerDashboard() {
  const stats = [
    {
      title: "Active Projects",
      value: "8",
      change: "+2 this month",
      icon: FolderKanban,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Active Sprints",
      value: "3",
      change: "On track",
      icon: Activity,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Pending Tasks",
      value: "24",
      change: "5 high priority",
      icon: ListTodo,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Team Work Hours",
      value: "148 hrs",
      change: "This sprint",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const ongoingProjects = [
    { name: "Acme Web App Redesign", lead: "Rahat Islam", progress: 75, status: "Active" },
    { name: "E-Commerce Mobile App", lead: "Sanzida Akter", progress: 40, status: "In Review" },
    { name: "HR Management Portal", lead: "Imam Hossain", progress: 90, status: "Active" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-1">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Manager Workspace
          </h1>
          <p className="text-sm text-zinc-400">
            Monitor projects, sprint lifecycles, and team efficiency dashboards.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-400 text-sm font-medium w-fit">
          <TrendingUp className="h-4 w-4" />
          <span>Sprint 4 is currently live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Projects List & Team Activities */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-200">Ongoing Projects</h2>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors cursor-pointer">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {ongoingProjects.map((proj, i) => (
              <div key={i} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-zinc-300">{proj.name}</h4>
                  <p className="text-xs text-zinc-500">Lead: {proj.lead}</p>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="w-24 md:w-32 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">{proj.progress}%</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    proj.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {proj.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Sprint Timeline</h3>
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-zinc-800 space-y-1">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10" />
                <h5 className="text-xs font-semibold text-zinc-300">Sprint Planning</h5>
                <p className="text-[11px] text-zinc-500">Completed on May 24</p>
              </div>
              <div className="relative pl-6 border-l border-zinc-800 space-y-1">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
                <h5 className="text-xs font-semibold text-zinc-300">Daily Standups</h5>
                <p className="text-[11px] text-zinc-500">Ongoing (10:00 AM daily)</p>
              </div>
              <div className="relative pl-6 space-y-1">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-zinc-700 ring-4 ring-zinc-700/10" />
                <h5 className="text-xs font-semibold text-zinc-400">Sprint Review & Demo</h5>
                <p className="text-[11px] text-zinc-600">Scheduled on June 04</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
            <span className="text-xs text-zinc-500">Logged in as Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
}
