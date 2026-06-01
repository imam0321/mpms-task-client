import ProjectCardSkeleton from "./ProjectCardSkeleton";
import StatsCardSkeleton from "./StatsCardSkeleton";

interface ProjectListPageSkeletonProps {
  showStats?: boolean;
}

export default function ProjectListPageSkeleton({
  showStats = false,
}: ProjectListPageSkeletonProps) {
  return (
    <div className="space-y-4">
      {showStats && <StatsCardSkeleton />}
      <div className="h-14 rounded-2xl border border-zinc-900 bg-zinc-950/40 animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
