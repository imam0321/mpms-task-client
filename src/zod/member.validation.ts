import { z } from "zod";

export const addMemberValidationSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "Manager", "Member"]),
  designation: z.string().optional(),
  department: z.string().optional(),
});

export const updateMemberValidationSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  role: z.enum(["Admin", "Manager", "Member"]),
  designation: z.string().optional(),
  department: z.string().optional(),
});
