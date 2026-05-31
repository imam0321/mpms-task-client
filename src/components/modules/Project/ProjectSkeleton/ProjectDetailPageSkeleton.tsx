export default function ProjectDetailPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* Header skeleton */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/20 space-y-4">
        <div className="h-6 w-40 bg-zinc-800 rounded" />
        <div className="h-8 w-2/3 bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-zinc-800 rounded" />
        <div className="h-4 w-5/6 bg-zinc-800 rounded" />
      </div>

      {/* Sprint skeleton */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/20 space-y-4">
        <div className="h-5 w-48 bg-zinc-800 rounded" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-32 bg-zinc-800 rounded" />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-20 bg-zinc-800 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}