"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getProjectProgressReport(projectId: string) {
  try {
    const res = await serverFetch.get(`/reports/project/${projectId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch project report" };
  }
}

export async function getUserWorkloadReport(userId: string) {
  try {
    const res = await serverFetch.get(`/reports/user/${userId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch user workload report" };
  }
}

export async function getOverviewReport(queryString?: string) {
  try {
    const res = await serverFetch.get(
      `/reports/overview${queryString ? `?${queryString}` : ""}`
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch overview report" };
  }
}
