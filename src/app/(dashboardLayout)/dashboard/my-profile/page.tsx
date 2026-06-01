import ProfileForm from "@/components/modules/Profile/ProfileForm";
import { getMyProfile } from "@/services/auth/profile.service";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
  const profileResponse = await getMyProfile();

  if (!profileResponse?.success || !profileResponse.data) {
    redirect("/login");
  }

  const user = profileResponse.data;

  return (
    <div className="space-y-6 p-1 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-sm text-zinc-400">
          View and update your account details, photo, and password.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
