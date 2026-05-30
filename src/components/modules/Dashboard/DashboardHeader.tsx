"use client"
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type TDashboardHeaderProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  buttonText?: string;
  handleAction?: () => void;
};

export default function DashboardHeader({
  title,
  description,
  icon: IconComponent,
  buttonText,
  handleAction,
}: TDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>

      {buttonText && (
        <Button onClick={handleAction} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-sm font-medium w-fit">
          {IconComponent && <IconComponent className="w-4 h-4" />}
          <span>{buttonText}</span>
        </Button>
      )}
    </div>
  );
}