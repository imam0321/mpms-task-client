"use client";

import React, { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/services/auth/logoutUser";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
      className="relative flex items-center gap-2 font-medium border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 hover:scale-[1.02] cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none rounded-lg px-4 py-2"
    >
      <LogOut className={`h-4 w-4 transition-transform duration-300 ${isPending ? "animate-spin" : "group-hover:-translate-x-1"}`} />
      <span>{isPending ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}
