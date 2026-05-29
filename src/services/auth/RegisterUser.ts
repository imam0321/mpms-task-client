/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { loginUser } from "./loginUser";
import { zodValidator } from "@/lib/zodValidator";
import { registerUserValidationZodSchema } from "@/zod/auth.validation";

export const registerUser = async (_currentState: any, formData: FormData): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      designation: formData.get("designation"),
      department: formData.get("department"),
      skills: formData.get("skills"),
    };

    const validatedPayload = zodValidator(payload, registerUserValidationZodSchema);

    if (!validatedPayload.success && validatedPayload.errors) {
      return {
        success: validatedPayload.success,
        message: "Validation failed",
        formData: payload,
        errors: validatedPayload.errors,
      }
    }

    if (!validatedPayload.data) {
      return {
        success: false,
        message: "Validation failed",
        formData: payload,
      }
    }

    const backendPayload = {
      name: validatedPayload.data.name,
      email: validatedPayload.data.email,
      password: validatedPayload.data.password,
      designation: validatedPayload.data.designation || undefined,
      department: validatedPayload.data.department || undefined,
      skills: validatedPayload.data.skills
        ? validatedPayload.data.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    }

    const res = await serverFetch.post("/users/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload)
    });

    const result = await res.json();
    console.log(result)
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Registration failed. Please try again.",
      };
    }

    formData.set("fromRegistration", "true");
    await loginUser(_currentState, formData);

    return {
      success: true,
      message: "Registration successful!",
    };

  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return {
      success: false,
      message: error.message || "Registration failed. Please try again."
    }
  }
};