"use client";

import Image from "next/image";
import { Edit2, Trash2, Briefcase, Building2, UserCheck, UserX } from "lucide-react";
import { IUser } from "@/types/api.types";
import { roleBadges, roleIcons } from "./team.constants";

interface TeamMemberMobileListProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export default function TeamMemberMobileList({
  users,
  onEdit,
  onDelete,
}: TeamMemberMobileListProps) {
  return (
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
              <h5 className="font-semibold text-zinc-200 truncate text-sm">{user.name}</h5>
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
                onClick={() => onEdit(user)}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(user)}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
