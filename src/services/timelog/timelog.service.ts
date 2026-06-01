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

import { zodValidator } from "@/lib/zodValidator";
import { timeLogValidationSchema } from "@/zod/timelog.validation";

export async function createTimeLog(
  prevState: any,
  formData: FormData
) {
  const task = formData.get("task") as string;
  const hours = formData.get("hours") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;

  const payload = {
    hours: hours || undefined,
    date: date || undefined,
    note: description || undefined,
  };

  const validatedPayload = zodValidator(payload, timeLogValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: { ...payload, task, description },
      errors: validatedPayload.errors,
    };
  }

  try {
    const res = await serverFetch.post("/timelogs", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task,
        hours: validatedPayload?.data?.hours,
        date: validatedPayload?.data?.date,
        description: validatedPayload?.data?.note,
      }),
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
