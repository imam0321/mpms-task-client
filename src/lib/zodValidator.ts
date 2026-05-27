import { ZodType } from "zod";

export const zodValidator = <T>(payload: unknown, schema: ZodType<T>) => {
  const validatedPayload = schema.safeParse(payload);

  if (!validatedPayload.success) {
    return {
      success: false,
      errors: validatedPayload.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: validatedPayload.data as T,
  };
};