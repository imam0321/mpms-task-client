export default function ProjectDetailHeaderSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {/* Back button */}
      <div className="h-4 w-32 rounded bg-zinc-800" />

      {/* Main card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/20 p-6 sm:p-8 flex flex-col lg:flex-row gap-8">

        {/* Thumbnail skeleton */}
        <div className="h-40 w-full lg:w-60 rounded-xl bg-zinc-900 border border-zinc-800" />

        {/* Content */}
        <div className="flex-1 space-y-6">

          {/* Client + title */}
          <div className="space-y-3">
            <div className="h-3 w-32 rounded bg-zinc-800" />
            <div className="h-7 w-2/3 rounded bg-zinc-800" />

            <div className="space-y-2 mt-4">
              <div className="h-3 w-full rounded bg-zinc-800" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-zinc-900/60">

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 rounded bg-zinc-800" />
                <div className="h-4 w-20 rounded bg-zinc-800" />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-zinc-800" />
              <div className="h-3 w-10 rounded bg-zinc-800" />
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800" />
          </div>

          {/* Team */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-24 rounded bg-zinc-800" />
            <div className="flex -space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}