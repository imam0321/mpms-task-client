"use client";

import Image from "next/image";
import { Edit2, Trash2, Mail, Building2, UserCheck, UserX } from "lucide-react";
import { IUser } from "@/types/api.types";
import { roleBadges, roleIcons } from "./team.constants";

interface TeamMemberTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export default function TeamMemberTable({ users, onEdit, onDelete }: TeamMemberTableProps) {
  return (
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
                  <span className="text-xs text-zinc-300">{user.designation || "—"}</span>
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
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
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
  );
}
