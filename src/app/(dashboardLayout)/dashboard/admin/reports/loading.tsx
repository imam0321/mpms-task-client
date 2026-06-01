import ReportsSkeleton from "@/components/modules/Reports/ReportsSkeleton";

export default function AdminReportsLoading() {
  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-8 w-40 bg-zinc-800 rounded" />
        <div className="h-4 w-96 bg-zinc-800 rounded" />
      </div>
      <ReportsSkeleton />
    </div>
  );
}
