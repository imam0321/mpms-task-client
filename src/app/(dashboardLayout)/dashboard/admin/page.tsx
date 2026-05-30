import StatsCard from "@/components/modules/Dashboard/StatsCard";
import DashboardHeader from "@/components/modules/Dashboard/DashboardHeader";
import { getAllProjects, getProjectStats } from "@/services/project/project.service";
import { getAllUsers } from "@/services/user/user.service";
import ProjectManagement from "@/components/modules/Project/ProjectManagement";
import { IProject } from "@/types/api.types";

export default async function AdminDashboard() {
  const allProjectsResponse = await getAllProjects("limit=1000");
  const allProjects = allProjectsResponse?.data || [];

  const projectStats = await Promise.all(
    allProjects.map((p: IProject) => getProjectStats(p._id).then((res) => res?.data))
  ).then((arr) => arr.filter(Boolean));

  const initialProjectsResponse = await getAllProjects("page=1&limit=10");
  const initialProjects = initialProjectsResponse?.data || [];
  const initialMeta = initialProjectsResponse?.meta;

  const usersResponse = await getAllUsers();
  const allUsers = usersResponse?.data || [];

  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Admin Dashboard"
        description="Overview of company resources, access levels, audit trails, and platform configurations."
      />

      <StatsCard projectStats={projectStats} />

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-zinc-100 font-heading">All Projects</h2>
        <ProjectManagement
          initialProjects={initialProjects}
          initialMeta={initialMeta}
          allUsers={allUsers}
          basePath="/dashboard/admin/projects"
        />
      </div>
    </div>
  );
}