import { getAllProjects } from "@/services/project/project.service";
import { getAllUsers } from "@/services/user/user.service";
import ProjectManagement from "@/components/modules/Project/ProjectManagement";
import PaginationHelper from "@/components/shared/PaginationHelper";
import { getUserInfo } from "@/services/auth/getUserInfo";

export default async function ManagerProjectsPage({
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

  const users = await getAllUsers();

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Project Management
        </h1>
        <p className="text-sm text-zinc-400">
          Create new client scopes, configure budgets, assign developers, and track execution status.
        </p>
      </div>

      <ProjectManagement
        projects={projects?.data || []}
        users={users?.data || []}
        basePath="/dashboard/manager/projects"
      />

      <PaginationHelper currentPage={projects?.meta?.page || 1} totalPages={projects?.meta?.totalPages || 1} />
    </div>
  );
}
