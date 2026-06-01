import StatsCard from "@/components/modules/Dashboard/StatsCard";
import DashboardHeader from "@/components/modules/Dashboard/DashboardHeader";
import { getAllProjects, getProjectStats } from "@/services/project/project.service";
import { getAllUsers } from "@/services/user/user.service";
import ProjectManagement from "@/components/modules/Project/ProjectManagement";
import { IProject, IProjectStats } from "@/types/api.types";
import PaginationHelper from "@/components/shared/PaginationHelper";
import { Suspense } from "react";
import StatsCardSkeleton from "@/components/modules/Project/ProjectSkeleton/StatsCardSkeleton";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsObj = await searchParams;

  const queryParams = new URLSearchParams();
  const validParams = ["searchTerm", "page", "status"];

  validParams.forEach((param) => {
    if (searchParamsObj[param]) {
      queryParams.set(param, String(searchParamsObj[param]));
    }
  });

  if (!queryParams.has("limit")) {
    queryParams.set("limit", "100");
  }

  const projects = await getAllProjects(queryParams.toString());
  const statsResults = await Promise.allSettled(
    (projects?.data ?? []).map((project: IProject) =>
      getProjectStats(project._id).then((res) => res?.data)
    )
  );
  const projectStats = statsResults
    .filter((r): r is PromiseFulfilledResult<IProjectStats> => r.status === "fulfilled" && !!r.value)
    .map((r) => r.value);

  const users = await getAllUsers();

  return (
    <div className="space-y-4">
      <DashboardHeader
        title="Admin Dashboard"
        description="Overview of company resources, access levels, audit trails, and platform configurations."
      />
      <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCard projectStats={projectStats} />
      </Suspense>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-zinc-100 font-heading">All Projects</h2>
        <ProjectManagement
          projects={projects?.data || []}
          users={users?.data || []}
          basePath="/dashboard/admin/projects"
        />

        {/* Pagination Helper */}
        <PaginationHelper currentPage={projects?.meta?.page || 1} totalPages={projects?.meta?.totalPages || 1} />
      </div>
    </div>
  );
}