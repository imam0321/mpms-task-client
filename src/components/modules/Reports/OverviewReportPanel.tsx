"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Folder,
  Layers,
  ClipboardList,
  Clock,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { getOverviewReport } from "@/services/reports/reports.service";
import { PaginationMeta } from "@/types/api.types";
import PaginationHelper from "@/components/shared/PaginationHelper";
import ReportsSkeleton from "./ReportsSkeleton";

interface ProjectSummary {
  id: string;
  title: string;
  totalTasks: number;
  completedTasks: number;
  loggedHours: number;
  completionRate: number;
}

interface OverviewData {
  systemStats: {
    totalProjects: number;
    totalSprints: number;
    totalTasks: number;
    totalLoggedHours: number;
  };
  projectsSummary: ProjectSummary[];
}

export default function OverviewReportPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        const res = await getOverviewReport(params.toString());
        if (res?.success) {
          setOverviewData(res.data as OverviewData);
          setMeta(res.meta);
        } else {
          toast.error(res?.message || "Failed to fetch overview metrics");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, [page]);

  if (isLoading && !overviewData) {
    return <ReportsSkeleton />;
  }

  if (!overviewData) {
    return (
      <div className="text-center py-10 text-zinc-600 text-xs">
        No overview data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Projects",
            value: overviewData.systemStats.totalProjects,
            icon: <Folder className="h-5 w-5 text-indigo-400" />,
          },
          {
            label: "Sprints Completed",
            value: overviewData.systemStats.totalSprints,
            icon: <Layers className="h-5 w-5 text-indigo-400" />,
          },
          {
            label: "Task Tickets",
            value: overviewData.systemStats.totalTasks,
            icon: <ClipboardList className="h-5 w-5 text-indigo-400" />,
          },
          {
            label: "Time Logged",
            value: `${overviewData.systemStats.totalLoggedHours}h`,
            icon: <Clock className="h-5 w-5 text-indigo-400" />,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md flex items-center justify-between hover:border-zinc-700/60 transition"
          >
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-100">{stat.value}</h2>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <h4 className="text-sm font-extrabold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Projects Progress Index
          </h4>
        </div>

        {isLoading ? (
          <div className="h-40 animate-pulse bg-zinc-900/30 rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-zinc-500 font-bold border-b border-zinc-900">
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[10px]">
                    Project Name
                  </th>
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[10px]">
                    Tasks Completed
                  </th>
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wider text-[10px]">
                    Time Logged
                  </th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] w-48 text-right">
                    Completion index
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {overviewData.projectsSummary?.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-900/10 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/admin/projects/${p.id}`)}
                  >
                    <td className="py-3.5 pr-4 font-semibold text-zinc-200">{p.title}</td>
                    <td className="py-3.5 pr-4 text-zinc-400 font-medium">
                      {p.completedTasks} / {p.totalTasks}
                    </td>
                    <td className="py-3.5 pr-4 text-zinc-400 font-medium">
                      {p.loggedHours} hrs
                    </td>
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
        )}

        {(meta?.totalPages ?? 1) > 1 && (
          <PaginationHelper
            currentPage={meta?.page || 1}
            totalPages={meta?.totalPages || 1}
          />
        )}
      </div>
    </div>
  );
}
