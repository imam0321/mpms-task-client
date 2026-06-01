"use client";

import { BarChart3, Folder, Users } from "lucide-react";

export type ReportTabType = "overview" | "projects" | "users";

interface ReportsTabsProps {
  activeTab: ReportTabType;
  onTabChange: (tab: ReportTabType) => void;
}

const tabs = [
  { id: "overview" as const, label: "Overview", icon: BarChart3 },
  { id: "projects" as const, label: "Projects", icon: Folder },
  { id: "users" as const, label: "Resource Workload", icon: Users },
];

export default function ReportsTabs({ activeTab, onTabChange }: ReportsTabsProps) {
  return (
    <div className="flex border border-zinc-800 rounded-2xl p-1 bg-zinc-950/20 backdrop-blur-md max-w-md w-full">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
