import { z } from "zod";

export const sprintValidationSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(1, "Sprint title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});
