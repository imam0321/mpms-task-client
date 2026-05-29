import { FolderGit2 } from "lucide-react";

interface LogoWithTitleProps {
  isAbsolute?: boolean;
  className?: string;
}

export default function LogoWithTitle({ isAbsolute = true, className = "" }: LogoWithTitleProps) {
  return (
    <div className={`${isAbsolute ? "absolute top-8 left-8" : "relative"} flex items-center gap-3 select-none z-50 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
        <FolderGit2 className="h-6 w-6 text-white" />
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tighter bg-linear-to-r from-blue-950 via-blue-700 to-cyan-600 dark:from-white dark:via-blue-200 dark:to-cyan-400 bg-clip-text text-transparent">
          MPMS
        </h1>
        <p className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-medium">
          Task Engine
        </p>
      </div>
    </div>
  );
}