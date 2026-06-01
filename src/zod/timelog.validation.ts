import { z } from "zod";

export const timeLogValidationSchema = z.object({
  hours: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ error: "Hours are required" }).min(0.1, "Hours must be at least 0.1")
  ),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});
