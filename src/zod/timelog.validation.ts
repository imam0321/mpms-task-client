import { z } from "zod";

export const timeLogValidationSchema = z.object({
  task: z.string().min(1, "Task is required"),
  hours: z.string({ message: "Hours is requied" }),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});
