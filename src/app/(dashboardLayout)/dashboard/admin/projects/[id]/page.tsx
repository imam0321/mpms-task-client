import React, { Suspense } from "react";
import { getProjectById } from "@/services/project/project.service";
import { getUserInfo } from "@/services/auth/getUserInfo";
import ProjectDetailView from "@/components/modules/Project/ProjectDetailView";
import { notFound } from "next/navigation";
import ProjectDetailPageSkeleton from "@/components/modules/Project/ProjectSkeleton/ProjectDetailPageSkeleton";
import { IUser } from "@/types/api.types";

interface Params {
  id: string;
}

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const project = await getProjectById(id);
  if (!project?.success || !project.data) {
    notFound();
  }

  const currentUser = await getUserInfo();

  return (
    <div className="space-y-6 p-1">
      <Suspense fallback={<ProjectDetailPageSkeleton />}>
        <ProjectDetailView
          project={project.data}
          currentUser={currentUser as IUser}
          backPath={`/dashboard/${(currentUser?.role) && (currentUser?.role).toLowerCase()}`}
        />
      </Suspense>
    </div>
  );
}
