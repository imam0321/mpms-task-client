import ProjectListPageSkeleton from "@/components/modules/Project/ProjectSkeleton/ProjectListPageSkeleton";

export default function MemberProjectsLoading() {
  return (
    <div className="space-y-4 p-1">
      <div className="animate-pulse space-y-2">
        <div className="h-7 w-40 bg-zinc-800 rounded" />
        <div className="h-4 w-64 bg-zinc-800 rounded" />
      </div>
      <ProjectListPageSkeleton />
    </div>
  );
}
