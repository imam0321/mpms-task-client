export default function StatsCardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-md animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-zinc-800" />

            <div className="h-9 w-9 rounded-xl bg-zinc-800" />
          </div>

          {/* Value */}
          <div className="my-5 space-y-2">
            <div className="h-8 w-32 rounded bg-zinc-800" />
            <div className="h-3 w-20 rounded bg-zinc-800" />
          </div>

          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}