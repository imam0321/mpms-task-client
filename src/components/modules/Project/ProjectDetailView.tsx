"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { toast } from "sonner";

import { IProject, ISprint, ITask, IUser } from "@/types/api.types";
import { getSprintsByProject } from "@/services/sprint/sprint.service";
import { getTasksBySprint } from "@/services/task/task.service";

import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectDetailHeaderSkeleton from "./ProjectSkeleton/ProjectDetailHeaderSkeleton";
import SprintManager from "../Sprint/SprintManagement";
import TaskManager from "../Task/TaskManager";

interface ProjectDetailViewProps {
  project: IProject;
  currentUser: IUser;
  backPath: string;
}

export default function ProjectDetailView({
  project,
  currentUser,
  backPath,
}: ProjectDetailViewProps) {
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [tasksBySprint, setTasksBySprint] = useState<Record<string, ITask[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const addTaskFnRef = useRef<(sprintId: string) => void>(() => { });
  const taskClickFnRef = useRef<(task: ITask) => void>(() => { });

  const canManage =
    currentUser.role === "Admin" || currentUser.role === "Manager";

  const fetchSprintsAndTasks = async () => {
    setIsLoading(true);
    try {
      const sprintsRes = await getSprintsByProject(project._id);
      if (!sprintsRes?.success) {
        toast.error(sprintsRes?.message || "Failed to load sprints");
        return;
      }

      const sorted = (sprintsRes.data || []).sort(
        (a: ISprint, b: ISprint) => (a.order ?? 0) - (b.order ?? 0)
      );
      setSprints(sorted);

      const results = await Promise.all(
        sorted.map((s: ISprint) => getTasksBySprint(s._id))
      );

      const tasksMap: Record<string, ITask[]> = {};
      sorted.forEach((sprint: ISprint, i: number) => {
        tasksMap[sprint._id] = results[i]?.success ? results[i].data || [] : [];
      });
      setTasksBySprint(tasksMap);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load sprints and tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSprintsAndTasks();
  }, [project._id]);

  return (
    <div className="space-y-4">
      {/* Project header */}
      <Suspense fallback={<ProjectDetailHeaderSkeleton />}>
        <ProjectDetailHeader project={project} backPath={backPath} />
      </Suspense>

      {/* Sprint board */}
      <SprintManager
        project={project}
        canManage={canManage}
        sprints={sprints}
        tasksBySprint={tasksBySprint}
        isLoading={isLoading}
        onRefresh={fetchSprintsAndTasks}
        onAddTask={(sprintId) => addTaskFnRef.current(sprintId)}
        onTaskClick={(task) => taskClickFnRef.current(task)}
      />

      {/* Task dialogs */}
      <TaskManager
        project={project}
        sprints={sprints}
        currentUser={currentUser}
        onRefresh={fetchSprintsAndTasks}
        onAddTaskRef={(fn) => { addTaskFnRef.current = fn; }}
        onTaskClickRef={(fn) => { taskClickFnRef.current = fn; }}
      />
    </div>
  );
}