import { z } from "zod";

export const projectValidationSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  client: z.string().min(1, "Client name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0, "Budget must be a positive number").optional()
  ),
  status: z.enum(["planned", "active", "completed", "archived"]).optional(),
  description: z.string().optional(),
  members: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
});
