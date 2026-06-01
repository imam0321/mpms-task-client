export default function TeamTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-zinc-800 rounded" />
        <div className="h-3 w-16 bg-zinc-800 rounded" />
      </div>

      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/20">
        <div className="border-b border-zinc-800 bg-zinc-950/50 p-4 flex gap-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 w-16 bg-zinc-800 rounded" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="flex items-center gap-4 p-4 border-b border-zinc-900/60 last:border-0"
          >
            <div className="h-9 w-9 rounded-full bg-zinc-800 shrink-0" />
            <div className="h-3 w-28 bg-zinc-800 rounded" />
            <div className="h-3 w-36 bg-zinc-800 rounded" />
            <div className="h-5 w-16 bg-zinc-800 rounded-full" />
            <div className="h-3 w-24 bg-zinc-800 rounded" />
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-5 w-14 bg-zinc-800 rounded-full ml-auto" />
            <div className="flex gap-2">
              <div className="h-7 w-7 bg-zinc-800 rounded-lg" />
              <div className="h-7 w-7 bg-zinc-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="block md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-zinc-800 rounded" />
                <div className="h-2.5 w-40 bg-zinc-800 rounded" />
              </div>
              <div className="h-5 w-14 bg-zinc-800 rounded-full" />
            </div>
            <div className="h-3 w-full bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
