import ProfileSkeleton from "@/components/modules/Profile/ProfileSkeleton";

export default function MyProfileLoading() {
  return (
    <div className="space-y-6 p-1 max-w-4xl">
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-8 w-36 bg-zinc-800 rounded" />
        <div className="h-4 w-64 bg-zinc-800 rounded" />
      </div>
      <ProfileSkeleton />
    </div>
  );
}
