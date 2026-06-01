"use client";

import { IUser } from "@/types/api.types";
import TeamMemberTable from "./TeamMemberTable";
import TeamMemberMobileList from "./TeamMemberMobileList";

interface TeamMemberListProps {
  users: IUser[];
  totalCount: number;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export default function TeamMemberList({
  users,
  totalCount,
  onEdit,
  onDelete,
}: TeamMemberListProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Team Members
        </h4>
        <span className="text-xs text-zinc-500">
          {totalCount} member{totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      <TeamMemberTable users={users} onEdit={onEdit} onDelete={onDelete} />
      <TeamMemberMobileList users={users} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
