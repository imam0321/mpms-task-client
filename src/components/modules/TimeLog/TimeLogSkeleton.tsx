export default function TimeLogSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-14 rounded-2xl border border-zinc-800 bg-zinc-950/20" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 rounded-2xl border border-zinc-800 bg-zinc-950/20" />
        <div className="h-24 rounded-2xl border border-zinc-800 bg-zinc-950/20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl border border-zinc-800 bg-zinc-950/20"
          />
        ))}
      </div>
    </div>
  );
}
