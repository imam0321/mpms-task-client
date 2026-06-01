"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";

function revalidateProjectPages() {
  revalidatePath("/dashboard/admin", "layout");
  revalidatePath("/dashboard/manager/projects");
  revalidatePath("/dashboard/member/projects");
}

export async function getAllProjects(queryString?: string) {
  try {
    const res = await serverFetch.get(
      `/projects${queryString ? `?${queryString}` : ""}`
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getProjectById(id: string) {
  try {
    const res = await serverFetch.get(`/projects/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch project detail" };
  }
}

import { zodValidator } from "@/lib/zodValidator";
import { projectValidationSchema } from "@/zod/project.validation";

export async function createProject(prevState: any, formData: FormData) {
  try {
    const title = formData.get("title");
    const client = formData.get("client");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const budget = formData.get("budget");
    const status = formData.get("status");
    const description = formData.get("description");
    const members = formData.get("members");

    const payload = {
      title,
      client,
      startDate,
      endDate,
      budget: budget || undefined,
      status,
      description,
      members: members || undefined,
    };

    const validatedPayload = zodValidator(payload, projectValidationSchema);

    if (!validatedPayload.success && validatedPayload.errors) {
      return {
        success: false,
        message: "Validation failed",
        formData: payload,
        errors: validatedPayload.errors,
      };
    }

    const backendFormData = new FormData();
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      backendFormData.append("file", file);
    }
    backendFormData.append("data", JSON.stringify(validatedPayload.data));

    const res = await serverFetch.post("/projects", {
      body: backendFormData,
    });
    const result = await res.json();
    if (!res.ok && !result?.message) {
      return {
        success: false,
        message: `Failed to create project (${res.status})`,
      };
    }
    if (result?.success) {
      revalidateProjectPages();
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create project" };
  }
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
  try {
    const title = formData.get("title");
    const client = formData.get("client");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const budget = formData.get("budget");
    const status = formData.get("status");
    const description = formData.get("description");
    const members = formData.get("members");

    const payload = {
      title,
      client,
      startDate,
      endDate,
      budget: budget || undefined,
      status,
      description,
      members: members || undefined,
    };

    const validatedPayload = zodValidator(payload, projectValidationSchema);

    if (!validatedPayload.success && validatedPayload.errors) {
      return {
        success: false,
        message: "Validation failed",
        formData: payload,
        errors: validatedPayload.errors,
      };
    }

    const backendFormData = new FormData();
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      backendFormData.append("file", file);
    }
    backendFormData.append("data", JSON.stringify(validatedPayload.data));

    const res = await serverFetch.put(`/projects/${id}`, {
      body: backendFormData,
    });
    const result = await res.json();
    if (result?.success) {
      revalidateProjectPages();
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    const res = await serverFetch.delete(`/projects/${id}`);
    const result = await res.json();
    if (result?.success) {
      revalidateProjectPages();
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete project" };
  }
}

export async function getProjectStats(id: string) {
  try {
    const res = await serverFetch.get(`/projects/${id}/stats`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch project stats" };
  }
}