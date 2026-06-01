import { getAllProjects } from "@/services/project/project.service";
import { getAllUsers } from "@/services/user/user.service";
import ReportsView from "@/components/modules/Reports/ReportsView";

export default async function AdminReportsPage() {
  const projectsResponse = await getAllProjects("limit=100");
  const projects = projectsResponse?.data || [];

  const usersResponse = await getAllUsers();
  const users = usersResponse?.data || [];

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          System Analytics & Reports
        </h1>
        <p className="text-sm text-zinc-400">
          Analyze project progress metrics, audit task status cycles, and review team resource workload allocations.
        </p>
      </div>

      <ReportsView projects={projects} users={users} />
    </div>
  );
}
