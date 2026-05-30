"use client";

import React from "react";
import { Calendar, DollarSign, Briefcase, Users, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IProject } from "@/types/api.types";
import { formatDate } from "@/lib/formatDate";

interface ProjectDetailHeaderProps {
  project: IProject;
  backPath: string;
}

export default function ProjectDetailHeader({ project, backPath }: ProjectDetailHeaderProps) {
  const start = new Date(project.startDate).getTime();
  const end = new Date(project.endDate).getTime();
  const now = new Date().getTime();
  const total = end - start;
  const elapsed = now - start;
  const progress = total > 0 ? Math.min(Math.round((elapsed / total) * 100), 100) : 0;
  const percentage = progress < 0 ? 0 : progress;

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

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Link
        href={backPath}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors duration-150 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
        <span>Back to Projects</span>
      </Link>

      {/* Main Glassmorphic Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Project Thumbnail or initials fallback */}
        <div className="relative h-40 w-full lg:w-60 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900">
              <span className="text-5xl font-extrabold tracking-widest text-zinc-600/80 uppercase">
                {project.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${config.badge}`}
          >
            {project.status}
          </span>
        </div>

        {/* Project Content */}
        <div className="flex-1 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{project.client}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mt-1">
                {project.title}
              </h1>
            </div>

            {project.description ? (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                {project.description}
              </p>
            ) : (
              <p className="text-sm text-zinc-500 italic">No description provided for this project.</p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-zinc-900/60">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Budget
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                <DollarSign className="h-4 w-4 shrink-0 -ml-1 text-emerald-500" />
                <span>{project.budget ? project.budget.toLocaleString() : "N/A"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Start Date
              </span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
                <Calendar className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{formatDate(project.startDate)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                End Date
              </span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
                <Calendar className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{formatDate(project.endDate)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <span>Timeline</span>
                <span className="text-zinc-400 font-semibold">{percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/60 mt-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.progress}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 shrink-0">
              <Users className="h-3.5 w-3.5" />
              <span>Project Team:</span>
            </span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {project.members && project.members.length > 0 ? (
                project.members.map((member) => (
                  <div
                    key={member._id}
                    title={`${member.name} (${member.role})`}
                    className="h-7 w-7 rounded-full ring-2 ring-zinc-950 bg-zinc-800 overflow-hidden flex items-center justify-center text-[10px] font-bold text-zinc-300 cursor-pointer hover:z-10 hover:scale-110 transition-transform duration-150"
                  >
                    {member.profileImg ? (
                      <img src={member.profileImg} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{member.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-zinc-600">No members assigned</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
