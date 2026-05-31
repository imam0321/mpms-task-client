export default function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 animate-pulse">
      {/* Thumbnail */}
      <div className="h-36 w-full bg-zinc-800" />

      <div className="p-4 space-y-4">
        {/* Title */}
        <div>
          <div className="h-4 w-3/4 rounded bg-zinc-800" />
          <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-zinc-800" />
          <div className="h-3 w-5/6 rounded bg-zinc-800" />
        </div>

        <hr className="border-zinc-800" />

        {/* Budget + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-zinc-800" />
            <div className="h-4 w-20 rounded bg-zinc-800" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-4 w-24 rounded bg-zinc-800" />
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-3 w-8 rounded bg-zinc-800" />
          </div>

          <div className="h-1.5 w-full rounded-full bg-zinc-800" />
        </div>

        {/* Team */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-zinc-800" />

          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full bg-zinc-800"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}