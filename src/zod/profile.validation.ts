import { z } from "zod";

export const updateProfileValidationSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  designation: z.string().optional(),
  department: z.string().optional(),
  skills: z.string().optional(),
});
