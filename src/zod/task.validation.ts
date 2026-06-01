import { z } from "zod";

export const taskValidationSchema = z.object({
  sprint: z.string().min(1, "Sprint target is required"),
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  estimate: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0, "Estimate must be a positive number").optional()
  ),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).optional(),
  subtasks: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(
      z.object({
        title: z.string().min(1, "Subtask title is required"),
        isCompleted: z.boolean().optional(),
      })
    ).optional()
  ),
  reviewRequired: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().optional()
  ),
});
