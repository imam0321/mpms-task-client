"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { IUser, PaginationMeta } from "@/types/api.types";
import { removeMember } from "@/services/user/user.service";
import TeamMemberFormDialog from "./TeamMemberFormDialog";
import TeamTableSkeleton from "./TeamSkeleton/TeamTableSkeleton";
import TeamMemberList from "./TeamMemberList";

interface TeamManagementProps {
  users: IUser[];
  meta?: PaginationMeta;
}

export default function TeamManagement({ users, meta }: TeamManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

  const handleOpenCreate = () => {
    setEditingUser(undefined);
    setOpenModal(true);
  };

  const handleOpenEdit = (user: IUser) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    startDeleteTransition(async () => {
      try {
        const res = await removeMember(userToDelete._id!);
        if (res?.success) {
          toast.success(res.message || "Member removed successfully!");
          setUserToDelete(null);
          handleRefresh();
        } else {
          toast.error(res?.message || "Failed to remove member");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An error occurred during removal";
        toast.error(message);
      }
    });
  };

  const totalCount = meta?.total ?? users.length;

  return (
    <div className="space-y-6">
      <div className="relative z-20 flex flex-col md:flex-row md:items-center gap-2.5 bg-zinc-950/40 border border-zinc-900 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md">
        <div className="flex-1 min-w-0 order-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search members by name, email, or designation..."
          />
        </div>
        <div className="w-full md:w-52 shrink-0 order-2">
          <SelectFilter
            paramName="role"
            placeholder="All Roles"
            options={[
              { value: "Admin", label: "Admin" },
              { value: "Manager", label: "Manager" },
              { value: "Member", label: "Member" },
            ]}
          />
        </div>
        <div className="w-full md:w-auto order-3">
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="
              w-full md:w-auto
              flex items-center justify-center gap-1.5
              bg-linear-to-r from-indigo-500 to-violet-600
              hover:from-indigo-600 hover:to-violet-700
              text-white font-medium border-0
              h-9 cursor-pointer rounded-xl
              shadow-md shadow-indigo-500/10
              transition-all duration-200
            "
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {isPending ? (
        <TeamTableSkeleton />
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center p-6">
          <Users className="h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No Members Found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            No team members match your current filters. Try a different search or add a new
            member.
          </p>
          <Button
            onClick={handleOpenCreate}
            variant="outline"
            className="mt-4 border-zinc-800 hover:border-zinc-700 text-zinc-300 cursor-pointer"
          >
            Add First Member
          </Button>
        </div>
      ) : (
        <TeamMemberList
          users={users}
          totalCount={totalCount}
          onEdit={handleOpenEdit}
          onDelete={setUserToDelete}
        />
      )}

      <TeamMemberFormDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleRefresh}
        user={editingUser}
      />

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Member"
        description={
          <>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-zinc-200">
              &quot;{userToDelete?.name}&quot;
            </span>
            ? This action is irreversible and will revoke their access to all projects and
            tasks.
          </>
        }
        confirmText="Remove Member"
        confirmVariant="destructive"
        isPending={isDeleting}
        zIndex={20}
      />
    </div>
  );
}
