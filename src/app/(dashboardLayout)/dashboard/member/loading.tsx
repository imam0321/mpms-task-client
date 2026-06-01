export default function MemberDashboardLoading() {
  return (
    <div className="space-y-8 p-1 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-56 bg-zinc-800 rounded" />
        <div className="h-4 w-80 bg-zinc-800 rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border border-zinc-800 bg-zinc-950/40" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/40" />
    </div>
  );
}
