import React from "react";
import { getProjectById } from "@/services/project/project.service";
import { getUserInfo } from "@/services/auth/getUserInfo";
import ProjectDetailView from "@/components/modules/Project/ProjectDetailView";
import { notFound } from "next/navigation";

interface Params {
  id: string;
}

export default async function MemberProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  
  const projectRes = await getProjectById(id);
  if (!projectRes?.success || !projectRes.data) {
    notFound();
  }
  
  const currentUser = await getUserInfo();

  return (
    <div className="space-y-6 p-1">
      <ProjectDetailView
        project={projectRes.data}
        currentUser={currentUser as any}
        backPath="/dashboard/member/projects"
      />
    </div>
  );
}
