/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getAllTasks(queryString?: string) {
  try {
    const endpoint = queryString ? `/tasks?${queryString}` : "/tasks";
    const res = await serverFetch.get(endpoint);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch tasks" };
  }
}

export async function getTasksBySprint(sprintId: string) {
  try {
    const res = await serverFetch.get(`/tasks/sprint/${sprintId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch sprint tasks" };
  }
}

import { zodValidator } from "@/lib/zodValidator";
import { taskValidationSchema } from "@/zod/task.validation";
import { timeLogValidationSchema } from "@/zod/timelog.validation";

export async function createTask(
  _prevState: any,
  formData: FormData) {
  const title = formData.get("title") as string;
  const sprint = formData.get("sprint") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const estimate = formData.get("estimate") as string;
  const dueDate = formData.get("dueDate") as string;
  const reviewRequired = formData.get("reviewRequired") === "true";
  const assignees = formData.getAll("assignees") as string[];
  const subtasksRaw = formData.get("subtasks") as string;

  const payload = {
    title: title || undefined,
    sprint: sprint || undefined,
    description: description || undefined,
    priority: priority || undefined,
    estimate: estimate || undefined,
    dueDate: dueDate || undefined,
    assignees: assignees || [],
    subtasks: subtasksRaw || undefined,
    reviewRequired: reviewRequired ? "true" : "false",
  };

  const validatedPayload = zodValidator(payload, taskValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: payload,
      errors: validatedPayload.errors,
    };
  }

  let subtasks = [];
  try {
    subtasks = subtasksRaw ? JSON.parse(subtasksRaw) : [];
  } catch {
    subtasks = [];
  }

  try {
    const res = await serverFetch.post("/tasks", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sprint: validatedPayload?.data?.sprint,
        title: validatedPayload?.data?.title,
        description: validatedPayload?.data?.description,
        priority: validatedPayload?.data?.priority,
        estimate: validatedPayload?.data?.estimate,
        dueDate: validatedPayload?.data?.dueDate,
        assignees: validatedPayload?.data?.assignees,
        subtasks: validatedPayload?.data?.subtasks,
        reviewRequired: validatedPayload?.data?.reviewRequired,
      }),
    });
    const result = await res.json();
    if (!result.success) {
      return { success: false, message: result.message || "Failed to create task" };
    }
    return { success: true, message: "Task created successfully!" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create task" };
  }
}

export async function getTaskById(id: string) {
  try {
    const res = await serverFetch.get(`/tasks/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch task" };
  }
}

export async function updateTask(
  _prevState: any,
  formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const sprint = formData.get("sprint") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const estimate = formData.get("estimate") as string;
  const dueDate = formData.get("dueDate") as string;
  const reviewRequired = formData.get("reviewRequired") === "true";
  const assignees = formData.getAll("assignees") as string[];
  const subtasksRaw = formData.get("subtasks") as string;

  const payload = {
    title: title || undefined,
    sprint: sprint || undefined,
    description: description || undefined,
    priority: priority || undefined,
    estimate: estimate || undefined,
    dueDate: dueDate || undefined,
    assignees: assignees || [],
    subtasks: subtasksRaw || undefined,
    reviewRequired: reviewRequired ? "true" : "false",
  };

  const validatedPayload = zodValidator(payload, taskValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: { ...payload, taskId },
      errors: validatedPayload.errors,
    };
  }

  let subtasks = [];
  try {
    subtasks = subtasksRaw ? JSON.parse(subtasksRaw) : [];
  } catch {
    subtasks = [];
  }

  try {
    const res = await serverFetch.put(`/tasks/${taskId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sprint: validatedPayload?.data?.sprint,
        title: validatedPayload?.data?.title,
        description: validatedPayload?.data?.description,
        priority: validatedPayload?.data?.priority || "Medium",
        estimate: validatedPayload?.data?.estimate,
        dueDate: validatedPayload?.data?.dueDate || undefined,
        assignees: validatedPayload?.data?.assignees,
        subtasks: validatedPayload?.data?.subtasks,
        reviewRequired: validatedPayload?.data?.reviewRequired,
      }),
    });
    const result = await res.json();
    if (!result.success) {
      return { success: false, message: result.message || "Failed to update task" };
    }
    return { success: true, message: "Task updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update task" };
  }
}

export async function changeTaskStatus(id: string, status: string) {
  try {
    const res = await serverFetch.patch(`/tasks/${id}/status`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to change task status" };
  }
}

export async function approveTask(id: string) {
  try {
    const res = await serverFetch.patch(`/tasks/${id}/approve`, {
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to approve task" };
  }
}

export async function deleteTask(id: string) {
  try {
    const res = await serverFetch.delete(`/tasks/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete task" };
  }
}

export async function addComment(taskId: string, data: { comment: string; parent?: string }) {
  try {
    const res = await serverFetch.post(`/tasks/${taskId}/comments`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add comment" };
  }
}

export async function addAttachment(taskId: string, formData: FormData) {
  try {
    const res = await serverFetch.post(`/tasks/${taskId}/attachments`, {
      body: formData,
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add attachment" };
  }
}

export async function logTime(
  prevState: any,
  formData: FormData
) {
  const taskId = formData.get("taskId") as string;
  const hours = formData.get("hours") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  const payload = {
    task: taskId,
    hours: hours ?? "",
    date: date ?? "",
    description: note || "",
  };

  const validatedPayload = zodValidator(payload, timeLogValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: {
        taskId,
        hours: payload.hours,
        date: payload.date,
        note: payload.description,
      },
      errors: validatedPayload.errors.map((err) =>
        err.field === "description" ? { ...err, field: "note" } : err
      ),
    };
  }

  try {
    const res = await serverFetch.post(`/tasks/${taskId}/timelogs`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hours: Number(validatedPayload.data?.hours),
        date: validatedPayload.data?.date,
        note: validatedPayload.data?.description || undefined,
      }),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to log time" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const res = await serverFetch.delete(`/comments/${commentId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete comment" };
  }
}
