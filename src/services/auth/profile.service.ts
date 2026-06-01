"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateProfileValidationSchema } from "@/zod/profile.validation";
import { ApiResponse, IUser } from "@/types/api.types";

export async function getMyProfile(): Promise<ApiResponse<IUser>> {
  try {
    const res = await serverFetch.get("/auth/me");
    return res.json();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return { success: false, message };
  }
}

export async function updateProfile(_prevState: unknown, formData: FormData) {
  try {
    const payload = {
      name: formData.get("name"),
      designation: formData.get("designation"),
      department: formData.get("department"),
      skills: formData.get("skills"),
    };

    const validatedPayload = zodValidator(payload, updateProfileValidationSchema);

    if (!validatedPayload.success && validatedPayload.errors) {
      return {
        success: false,
        message: "Validation failed",
        formData: payload,
        errors: validatedPayload.errors,
      };
    }

    if (!validatedPayload.data) {
      return { success: false, message: "Validation failed", formData: payload };
    }

    const profileData = validatedPayload.data;

    const backendPayload: Record<string, unknown> = {
      name: profileData.name,
      designation: profileData.designation || undefined,
      department: profileData.department || undefined,
      skills: profileData.skills
        ? profileData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    const backendFormData = new FormData();
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      backendFormData.append("file", file);
    }
    backendFormData.append("data", JSON.stringify(backendPayload));

    const res = await serverFetch.patch("/auth/me", { body: backendFormData });
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, message };
  }
}
