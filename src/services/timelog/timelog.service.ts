"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getTimeLogsByTask(taskId: string) {
  try {
    const res = await serverFetch.get(`/timelogs/task/${taskId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch time logs" };
  }
}

export async function createTimeLog(data: {
  task: string;
  hours: number;
  date: string;
  description?: string;
}) {
  try {
    const res = await serverFetch.post("/timelogs", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create time log" };
  }
}

export async function deleteTimeLog(id: string) {
  try {
    const res = await serverFetch.delete(`/timelogs/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete time log" };
  }
}
