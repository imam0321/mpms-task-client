import ProjectListPageSkeleton from "@/components/modules/Project/ProjectSkeleton/ProjectListPageSkeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse space-y-2">
        <div className="h-7 w-48 bg-zinc-800 rounded" />
        <div className="h-4 w-72 bg-zinc-800 rounded" />
      </div>
      <ProjectListPageSkeleton showStats />
    </div>
  );
}
