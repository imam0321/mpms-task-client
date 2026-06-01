import TimeLogSkeleton from "@/components/modules/TimeLog/TimeLogSkeleton";

export default function ManagerTimeLogsLoading() {
  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-8 w-52 bg-zinc-800 rounded" />
        <div className="h-4 w-80 bg-zinc-800 rounded" />
      </div>
      <TimeLogSkeleton />
    </div>
  );
}
