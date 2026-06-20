/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { toast } from "sonner";

import { IProject, ISprint, ITask, IUser } from "@/types/api.types";
import { getSprintsByProject } from "@/services/sprint/sprint.service";
import { getTasksBySprint } from "@/services/task/task.service";
import { getProjectById } from "@/services/project/project.service";
import { getAllUsers } from "@/services/user/user.service";

import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectDetailHeaderSkeleton from "./ProjectSkeleton/ProjectDetailHeaderSkeleton";
import SprintManager from "../Sprint/SprintManagement";
import TaskManager from "../Task/TaskManager";
import ProjectFormDialog from "./ProjectFormDialog";

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
  const [currentProject, setCurrentProject] = useState<IProject>(project);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [tasksBySprint, setTasksBySprint] = useState<Record<string, ITask[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);

  const addTaskFnRef = useRef<(sprintId: string) => void>(() => { });
  const taskClickFnRef = useRef<(task: ITask) => void>(() => { });
  const editTaskFnRef = useRef<(task: ITask) => void>(() => { });
  const deleteTaskFnRef = useRef<(task: ITask) => void>(() => { });

  const canManage =
    currentUser.role === "Admin" || currentUser.role === "Manager";

  // Fetch all users on mount for ProjectFormDialog if user can manage
  useEffect(() => {
    if (canManage) {
      getAllUsers().then((res) => {
        if (res?.success && res.data) {
          setAllUsers(res.data);
        }
      });
    }
  }, [canManage]);

  const fetchSprintsAndTasks = async () => {
    setIsLoading(true);
    try {
      const sprintsRes = await getSprintsByProject(currentProject._id);
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
  }, [currentProject._id]);

  const handleEditSuccess = async () => {
    try {
      const res = await getProjectById(currentProject._id);
      if (res?.success && res.data) {
        setCurrentProject(res.data);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to refresh project details");
    }
  };

  // Calculate task-based completion progress percentage
  const allTasks = Object.values(tasksBySprint).flat();
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "Done").length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Project header */}
      <Suspense fallback={<ProjectDetailHeaderSkeleton />}>
        <ProjectDetailHeader
          project={currentProject}
          backPath={backPath}
          onEdit={canManage ? () => setIsEditOpen(true) : undefined}
          taskPercentage={taskPercentage}
          totalTasks={totalTasks}
        />
      </Suspense>

      {/* Sprint board */}
      <SprintManager
        project={currentProject}
        canManage={canManage}
        sprints={sprints}
        tasksBySprint={tasksBySprint}
        isLoading={isLoading}
        onRefresh={fetchSprintsAndTasks}
        onAddTask={(sprintId) => addTaskFnRef.current(sprintId)}
        onTaskClick={(task) => taskClickFnRef.current(task)}
        onEditTask={canManage ? (task) => editTaskFnRef.current(task) : undefined}
        onDeleteTask={canManage ? (task) => deleteTaskFnRef.current(task) : undefined}
      />

      {/* Task dialogs */}
      <TaskManager
        project={currentProject}
        sprints={sprints}
        currentUser={currentUser}
        onRefresh={fetchSprintsAndTasks}
        onAddTaskRef={(fn) => { addTaskFnRef.current = fn; }}
        onTaskClickRef={(fn) => { taskClickFnRef.current = fn; }}
        onEditTaskRef={(fn) => { editTaskFnRef.current = fn; }}
        onDeleteTaskRef={(fn) => { deleteTaskFnRef.current = fn; }}
      />

      {/* Project edit form dialog */}
      {canManage && (
        <ProjectFormDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={handleEditSuccess}
          project={currentProject}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}