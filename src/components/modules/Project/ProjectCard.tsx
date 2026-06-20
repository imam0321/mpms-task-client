/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/formatDate";
import { IProject } from "@/types/api.types";
import { Calendar, DollarSign, Edit, Trash2, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  project: IProject;
  onEdit?: (project: IProject) => void;
  onDelete?: (project: IProject) => void;
  basePath?: string;
}

export default function ProjectCard({ project, onEdit, onDelete, basePath }: ProjectCardProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    const progress = total > 0 ? Math.min(Math.round((elapsed / total) * 100), 100) : 0;
    setPercentage(progress < 0 ? 0 : progress);
  }, [project.startDate, project.endDate]);

  const statusConfig = {
    planned: {
      badge: "bg-[#AFA9EC]/15 text-[#AFA9EC] border-[#AFA9EC]/30",
      thumb: "bg-[#534AB7]",
      progress: "bg-[#7F77DD]",
    },
    active: {
      badge: "bg-[#5DCAA5]/15 text-[#5DCAA5] border-[#5DCAA5]/30",
      thumb: "bg-[#1D9E75]",
      progress: "bg-[#1D9E75]",
    },
    completed: {
      badge: "bg-[#9FE1CB]/15 text-[#9FE1CB] border-[#9FE1CB]/30",
      thumb: "bg-[#0F6E56]",
      progress: "bg-[#0F6E56]",
    },
    archived: {
      badge: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
      thumb: "bg-zinc-700",
      progress: "bg-zinc-500",
    },
  };

  const config = statusConfig[project.status] ?? statusConfig.archived;

  const content = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 z-10">

      <div className={`relative h-36 w-full overflow-hidden ${config.thumb}`}>
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-medium tracking-widest text-white/90">
              {project.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest backdrop-blur-sm ${config.badge}`}
        >
          {project.status}
        </span>

        <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onEdit(project); }}
              aria-label="Edit project"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/80 transition-all duration-150 hover:bg-black/65 hover:text-white"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(project); }}
              aria-label="Delete project"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/80 transition-all duration-150 hover:bg-black/65 hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">

        <div>
          <h3 className="truncate text-[15px] font-medium text-zinc-100">
            {project.title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span>{project.client}</span>
          </div>
        </div>

        {project.description && (
          <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-zinc-500">
            {project.description}
          </p>
        )}

        <hr className="border-zinc-800/70" />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Budget
            </span>
            <div className="flex items-center gap-0.5 text-xs font-medium text-[#1D9E75]">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span>{project.budget ? project.budget.toLocaleString() : "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Start date
            </span>
            <div className="flex items-center gap-1 text-xs font-medium text-zinc-400">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span className="truncate">{formatDate(project.startDate)}</span>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Time elapsed
            </span>
            <span className="text-[11px] font-medium text-zinc-300">
              {percentage}%
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-800/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.progress}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Team
          </span>
          <div className="flex">
            {project.members && project.members.length > 0 ? (
              <>
                {project.members.slice(0, 4).map((member) => (
                  <div
                    key={member._id}
                    title={`${member.name} (${member.role})`}
                    className="-ml-1.5 flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-zinc-950 bg-[#3C3489] text-[10px] font-medium text-[#AFA9EC] transition-transform duration-150 hover:z-10 hover:scale-110 first:ml-0"
                  >
                    {member.profileImg ? (
                      <img
                        src={member.profileImg}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{member.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                ))}
                {project.members.length > 4 && (
                  <div
                    title={`${project.members.length - 4} more members`}
                    className="-ml-1.5 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-950 bg-zinc-800 text-[9px] font-medium text-zinc-400"
                  >
                    +{project.members.length - 4}
                  </div>
                )}
              </>
            ) : (
              <span className="text-xs text-zinc-600">No members</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  if (basePath) {
    return (
      <Link href={`${basePath}/${project._id}`} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}