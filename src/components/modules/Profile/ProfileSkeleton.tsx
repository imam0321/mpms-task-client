export default function ProfileSkeleton() {
  return (
    <div className="max-w-3xl animate-pulse">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/80 flex items-center gap-4">
          <div className="h-[72px] w-[72px] rounded-full bg-zinc-800" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 bg-zinc-800 rounded" />
            <div className="h-4 w-52 bg-zinc-800 rounded" />
            <div className="h-5 w-16 bg-zinc-800 rounded-full" />
          </div>
          <div className="h-9 w-28 bg-zinc-800 rounded-xl" />
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="h-12 bg-zinc-900/40 rounded-xl" />
          <div className="h-12 bg-zinc-900/40 rounded-xl" />
          <div className="h-12 bg-zinc-900/40 rounded-xl sm:col-span-2" />
        </div>
      </div>
    </div>
  );
}
