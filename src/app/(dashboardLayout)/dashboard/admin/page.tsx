import React from "react";
import { Users, FolderKanban, ShieldCheck, FileSpreadsheet, Server, Sparkles, UserPlus, FileText } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total System Users",
      value: "142",
      change: "+12 register this week",
      icon: Users,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Global Projects",
      value: "18",
      change: "All departments included",
      icon: FolderKanban,
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      title: "System Integrity",
      value: "99.9%",
      change: "Active & Secure",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Exported Reports",
      value: "35",
      change: "Auto-generated daily",
      icon: FileSpreadsheet,
      color: "from-rose-500 to-pink-600",
    },
  ];

  const systemLogs = [
    { event: "New manager user 'Rahat Islam' created", time: "10 mins ago", type: "info" },
    { event: "Database backup successfully completed", time: "1 hour ago", type: "success" },
    { event: "API boundary test run (sprints domain)", time: "3 hours ago", type: "warning" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-1">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Admin Control Center
          </h1>
          <p className="text-sm text-zinc-400">
            Overview of company resources, access levels, audit trails, and platform configurations.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-sm font-medium w-fit">
          <Server className="h-4 w-4" />
          <span>System status: Operational</span>
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

      {/* Audit Logs & Admin Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-zinc-200 mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Platform Activity Logs
          </h2>
          <div className="space-y-4">
            {systemLogs.map((log, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/40">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-300">{log.event}</p>
                  <span className="text-[10px] text-zinc-500">{log.time}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  log.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : log.type === "warning"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200">Quick Operations</h3>
            <p className="text-xs text-zinc-500">Perform direct system modifications and updates instantly.</p>
            <div className="space-y-2 pt-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all duration-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-indigo-400" /> Create Member/Manager
                </span>
                <span className="text-[10px] text-zinc-500">Add User</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all duration-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-400" /> Export System Audit
                </span>
                <span className="text-[10px] text-zinc-500">CSV/PDF</span>
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
            <span className="text-xs text-zinc-500">Logged in as Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
