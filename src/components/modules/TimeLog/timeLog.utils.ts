import { ITimeLog } from "@/types/api.types";

export function getLogDescription(log: ITimeLog): string | undefined {
  return log.description || (log as ITimeLog & { note?: string }).note;
}
