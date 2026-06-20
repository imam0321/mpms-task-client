/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { sprintValidationSchema } from "@/zod/sprint.validation";

export async function getSprintsByProject(projectId: string) {
  try {
    const res = await serverFetch.get(`/sprints/project/${projectId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch sprints" };
  }
}

export async function createSprint(
  _prevState: any,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const projectId = formData.get("projectId") as string;

  const payload = { projectId, title, startDate, endDate };

  const validatedPayload = zodValidator(payload, sprintValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: { ...payload, sprintId: "" },
      errors: validatedPayload.errors,
    };
  }

  try {
    const res = await serverFetch.post("/sprints", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: validatedPayload?.data?.projectId,
        title: validatedPayload?.data?.title,
        startDate: validatedPayload?.data?.startDate,
        endDate: validatedPayload?.data?.endDate,
      }),
    });
    const result = await res.json();

    if (!result.success) {
      return { success: false, message: result.message || "Failed to create sprint" };
    }

    return { success: true, message: "Sprint created successfully!" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create sprint" };
  }
}

export async function updateSprint(
  _prevState: any,
  formData: FormData
) {
  const sprintId = formData.get("sprintId") as string;
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  const payload = { projectId, title, startDate, endDate };

  const validatedPayload = zodValidator(payload, sprintValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: { ...payload, sprintId },
      errors: validatedPayload.errors,
    };
  }

  try {
    const res = await serverFetch.put(`/sprints/${sprintId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: sprintId,
        title: validatedPayload?.data?.title,
        startDate: startDate,
        endDate: endDate,
      }),
    });
    const result = await res.json();

    if (!result.success) {
      return { success: false, message: result.message || "Failed to update sprint" };
    }

    return { success: true, message: "Sprint updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update sprint" };
  }
}

export async function deleteSprint(id: string) {
  try {
    const res = await serverFetch.delete(`/sprints/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete sprint" };
  }
}

export async function reorderSprint(id: string, newOrder: number) {
  try {
    const res = await serverFetch.patch(`/sprints/${id}/reorder`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to reorder sprint" };
  }
}
