import { getAllProjects } from "@/services/project/project.service";
import { getUserInfo } from "@/services/auth/getUserInfo";
import TimeLogManagement from "@/components/modules/TimeLog/TimeLogManagement";

export default async function MemberTimeLogsPage() {
  const projectsResponse = await getAllProjects("limit=100");
  const projects = projectsResponse?.data || [];
  const currentUser = await getUserInfo();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-sm">
        Please log in to view your time logs sheet.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          My Time Registry
        </h1>
        <p className="text-sm text-zinc-400">
          Record work hours spent on assignments, add details for logged milestones, and view weekly totals.
        </p>
      </div>

      <TimeLogManagement projects={projects} currentUser={currentUser as any} />
    </div>
  );
}
