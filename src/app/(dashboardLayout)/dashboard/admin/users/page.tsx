import { getAllUsers } from "@/services/user/user.service";
import TeamManagement from "@/components/modules/Team/TeamManagement";

export default async function AdminUsersPage() {
  const usersResponse = await getAllUsers();
  const allUsers = usersResponse?.data || [];

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Team Members
        </h1>
        <p className="text-sm text-zinc-400">
          Manage your organization&apos;s team members, roles, and access levels.
        </p>
      </div>

      <TeamManagement initialUsers={allUsers} />
    </div>
  );
}
