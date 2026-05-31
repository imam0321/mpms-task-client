/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";
import { IProject, IUser } from "@/types/api.types";
import { deleteProject } from "@/services/project/project.service";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import NoProjectsFound from "./NoProjectsFound";
import ProjectFormDialog from "./ProjectFormDialog";
import ProjectCardSkeleton from "./ProjectSkeleton/ProjectCardSkeleton";

interface ProjectManagementProps {
  projects: IProject[];
  users: IUser[];
  basePath?: string;
  canManage?: boolean;
}

export default function ProjectManagement({
  projects,
  users,
  basePath,
  canManage = true,
}: ProjectManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<IProject | null>(null);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleOpenCreate = () => {
    setEditingProject(undefined);
    setOpenModal(true);
  };

  const handleOpenEdit = (project: IProject) => {
    setEditingProject(project);
    setOpenModal(true);
  };

  const handleSuccess = () => {
    handleRefresh();
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      const res = await deleteProject(projectToDelete._id);
      if (res.success) {
        toast.success(res.message || "Project deleted successfully");
        handleRefresh();
      } else {
        toast.error(res.message || "Failed to delete project");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete project");
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative z-20 flex flex-col md:flex-row md:items-center gap-2.5 bg-zinc-950/40 border border-zinc-900 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md">
        <div className="flex-1 min-w-0 order-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search projects or clients..."
          />
        </div>
        <div className="w-full md:w-52 shrink-0 order-2">
          <SelectFilter
            paramName="status"
            options={[
              { value: "planned", label: "Planned" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "archived", label: "Archived" },
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
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Main List Display */}
      {(isPending) ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <NoProjectsFound />
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {projects?.length > 0 && (
            <div className="space-y-4 z-10">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Featured Projects</h4>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={canManage ? handleOpenEdit : undefined}
                    onDelete={canManage ? setProjectToDelete : undefined}
                    basePath={basePath}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {canManage && (
        <ProjectFormDialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={handleSuccess}
          project={editingProject}
          allUsers={users}
        />
      )}
      {canManage && (
        <ConfirmDialog
          open={!!projectToDelete}
          setOpen={(val) => !val && setProjectToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Project"
          description={
            <>
              Are you sure you want to delete project <span className="font-semibold text-zinc-200">&quot;{projectToDelete?.title}&quot;</span>? This action is irreversible.
            </>
          }
          confirmText="Delete Project"
          confirmVariant="destructive"
          disabled={isPending}
        />
      )}
    </div>
  );
}
