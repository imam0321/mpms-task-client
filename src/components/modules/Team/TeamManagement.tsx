"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Users,
  Edit2,
  Trash2,
  Shield,
  Mail,
  Building2,
  Briefcase,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { IUser, UserRole, PaginationMeta } from "@/types/api.types";
import { removeMember } from "@/services/user/user.service";
import TeamMemberFormDialog from "./TeamMemberFormDialog";
import TeamTableSkeleton from "./TeamSkeleton/TeamTableSkeleton";

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
    startTransition(() => {
      router.refresh();
    });
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

  const roleBadges: Record<UserRole, string> = {
    Admin: "bg-red-500/10 text-red-400 border-red-500/20",
    Manager: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Member: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    Admin: <Shield className="h-3 w-3" />,
    Manager: <Briefcase className="h-3 w-3" />,
    Member: <UserCheck className="h-3 w-3" />,
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
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Team Members
            </h4>
            <span className="text-xs text-zinc-500">
              {totalCount} member{totalCount !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="p-4">Member</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-zinc-900/20 transition-all duration-150"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.profileImg ? (
                            <Image
                              src={user.profileImg}
                              alt={user.name}
                              width={36}
                              height={36}
                              unoptimized
                              className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 border border-zinc-700/50 text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold text-zinc-200">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${roleBadges[user.role]}`}
                        >
                          {roleIcons[user.role]}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-zinc-300">
                          {user.designation || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          {user.department ? (
                            <>
                              <Building2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span>{user.department}</span>
                            </>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {user.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                            <UserX className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  {user.profileImg ? (
                    <Image
                      src={user.profileImg}
                      alt={user.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 border border-zinc-700/50">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-zinc-200 truncate text-sm">
                      {user.name}
                    </h5>
                    <span className="text-xs text-zinc-500">{user.email}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0 ${roleBadges[user.role]}`}
                  >
                    {roleIcons[user.role]}
                    {user.role}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-zinc-900/60">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span>{user.designation || "No designation"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Building2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span>{user.department || "No dept"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  {user.isActive !== false ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-semibold uppercase">
                      <UserX className="h-3 w-3" /> Inactive
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(user)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserToDelete(user)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
