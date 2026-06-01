"use client";

import { useState, Suspense } from "react";
import { IProject, IUser } from "@/types/api.types";
import ReportsTabs, { ReportTabType } from "./ReportsTabs";
import OverviewReportPanel from "./OverviewReportPanel";
import ProjectReportPanel from "./ProjectReportPanel";
import UserWorkloadPanel from "./UserWorkloadPanel";
import ReportsSkeleton from "./ReportsSkeleton";

interface ReportsViewProps {
  projects: IProject[];
  users: IUser[];
}

export default function ReportsView({ projects, users }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState<ReportTabType>("overview");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <Suspense fallback={<ReportsSkeleton />}>
          <OverviewReportPanel />
        </Suspense>
      )}

      {activeTab === "projects" && <ProjectReportPanel projects={projects} />}

      {activeTab === "users" && <UserWorkloadPanel users={users} />}
    </div>
  );
}
