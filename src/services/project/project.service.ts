"use server";

import { serverFetch } from "@/lib/server-fetch";

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
      budget: budget ? Number(budget) : undefined,
      status,
      description,
      members: members ? JSON.parse(members as string) : [],
    };

    const backendFormData = new FormData();
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      backendFormData.append("file", file);
    }
    backendFormData.append("data", JSON.stringify(payload));

    const res = await serverFetch.post("/projects", {
      body: backendFormData,
    });
    const result = await res.json();
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
      budget: budget ? Number(budget) : undefined,
      status,
      description,
      members: members ? JSON.parse(members as string) : [],
    };

    const backendFormData = new FormData();
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      backendFormData.append("file", file);
    }
    backendFormData.append("data", JSON.stringify(payload));

    const res = await serverFetch.put(`/projects/${id}`, {
      body: backendFormData,
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    const res = await serverFetch.delete(`/projects/${id}`);
    const result = await res.json();
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