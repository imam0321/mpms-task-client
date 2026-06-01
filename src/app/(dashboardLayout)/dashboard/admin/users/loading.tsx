import TeamTableSkeleton from "@/components/modules/Team/TeamSkeleton/TeamTableSkeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="h-4 w-72 bg-zinc-800 rounded" />
      </div>
      <div className="h-14 bg-zinc-900/40 border border-zinc-900 rounded-2xl animate-pulse" />
      <TeamTableSkeleton />
    </div>
  );
}
