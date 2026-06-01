"use server";

import { serverFetch } from "@/lib/server-fetch";
import { ApiResponse, IUser } from "@/types/api.types";

export async function getAllUsers(queryString?: string): Promise<ApiResponse<IUser[]>> {
  try {
    const res = await serverFetch.get(`/users${queryString ? `?${queryString}` : ""}`);
    return res.json();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return { success: false, message };
  }
}

import { zodValidator } from "@/lib/zodValidator";
import { addMemberValidationSchema, updateMemberValidationSchema } from "@/zod/member.validation";

export async function addMember(prevState: any, formData: FormData): Promise<any> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const designation = formData.get("designation") as string;
  const department = formData.get("department") as string;

  const payload = {
    name: name || undefined,
    email: email || undefined,
    password: password || undefined,
    role: role || undefined,
    designation: designation || undefined,
    department: department || undefined,
  };

  const validatedPayload = zodValidator(payload, addMemberValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: payload,
      errors: validatedPayload.errors,
    };
  }

  try {
    const res = await serverFetch.post("/users", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedPayload.data),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add member" };
  }
}

export async function updateMember(prevState: any, formData: FormData): Promise<any> {
  const id = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const designation = formData.get("designation") as string;
  const department = formData.get("department") as string;

  const payload = {
    name: name || undefined,
    role: role || undefined,
    designation: designation || undefined,
    department: department || undefined,
  };

  const validatedPayload = zodValidator(payload, updateMemberValidationSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: { ...payload, userId: id },
      errors: validatedPayload.errors,
    };
  }

  try {
    const res = await serverFetch.put(`/users/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedPayload.data),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update member" };
  }
}

export async function removeMember(id: string): Promise<ApiResponse<null>> {
  const res = await serverFetch.delete(`/users/${id}`);
  return res.json();
}
