import { getAllUsers } from "@/services/user/user.service";
import TeamManagement from "@/components/modules/Team/TeamManagement";
import PaginationHelper from "@/components/shared/PaginationHelper";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsObj = await searchParams;

  const queryParams = new URLSearchParams();
  const validParams = ["searchTerm", "page", "role"];

  queryParams.set("listType", "team");
  if (!searchParamsObj.page) {
    queryParams.set("page", "1");
  }

  validParams.forEach((param) => {
    if (searchParamsObj[param]) {
      queryParams.set(param, String(searchParamsObj[param]));
    }
  });

  const usersResponse = await getAllUsers(queryParams.toString());
  const users = usersResponse?.data || [];

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Team Members
        </h1>
        <p className="text-sm text-zinc-400">
          Manage other team members, roles, and access levels. To update your own details, go to{" "}
          <a href="/dashboard/my-profile" className="text-indigo-400 hover:text-indigo-300 underline">
            My Profile
          </a>
          .
        </p>
      </div>

      <TeamManagement users={users} meta={usersResponse?.meta} />

      <PaginationHelper
        currentPage={usersResponse?.meta?.page || 1}
        totalPages={usersResponse?.meta?.totalPages || 1}
      />
    </div>
  );
}
