/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useActionState, useRef } from "react";
import { Clock } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";
import { formatDate } from "@/lib/formatDate";
import { logTime } from "@/services/task/task.service";

interface TaskDetailTimeLogsTabProps {
  taskId: string;
  timelogs: any[];
  fetchTaskDetails: () => Promise<void>;
}

export default function TaskDetailTimeLogsTab({
  taskId,
  timelogs,
  fetchTaskDetails,
}: TaskDetailTimeLogsTabProps) {
  const [logHours, setLogHours] = useState<number | "">("");
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [logNote, setLogNote] = useState("");

  const [logTimeState, logTimeAction, isLoggingTimePending] = useActionState(
    logTime,
    null,
  );

  const prevLogTimeStateRef = useRef(logTimeState);

  useEffect(() => {
    if (logTimeState === prevLogTimeStateRef.current) return;
    prevLogTimeStateRef.current = logTimeState;

    if (logTimeState) {
      if (logTimeState.success) {
        setLogHours("");
        setLogNote("");
        toast.success("Time logged successfully!");
        fetchTaskDetails();
      } else {
        if (
          logTimeState.message &&
          logTimeState.message !== "Validation failed"
        ) {
          toast.error(logTimeState.message);
        }
        if (logTimeState.formData) {
          setLogHours(
            logTimeState.formData.hours
              ? Number(logTimeState.formData.hours)
              : "",
          );
          setLogDate(logTimeState.formData.date || "");
          setLogNote(logTimeState.formData.note || "");
        }
      }
    }
  }, [logTimeState, fetchTaskDetails]);

  return (
    <div className="space-y-6">
      {/* Log time form */}
      <form
        action={logTimeAction}
        className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4"
      >
        <input type="hidden" name="taskId" value={taskId} />
        <h6 className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-indigo-400" />
          Log Work Hours
        </h6>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
              Hours *
            </FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="hours"
                placeholder="Hours, e.g. 2.5"
                value={logHours}
                onChange={(e) =>
                  setLogHours(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                required
              />
              <InputFieldError field="hours" state={logTimeState} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
              Date *
            </FieldLabel>
            <FieldContent>
              <Input
                type="date"
                name="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9 cursor-pointer"
                required
              />
              <InputFieldError field="date" state={logTimeState} />
            </FieldContent>
          </Field>
        </div>
        <Field>
          <FieldLabel className="text-[10px] uppercase font-bold text-zinc-500">
            Log Description
          </FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="note"
              placeholder="What did you work on? E.g. Refactored controllers"
              value={logNote}
              onChange={(e) => setLogNote(e.target.value)}
              className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
            />
            <InputFieldError field="note" state={logTimeState} />
          </FieldContent>
        </Field>
        <Button
          type="submit"
          disabled={isLoggingTimePending || !logHours}
          className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
        >
          {isLoggingTimePending ? "Logging..." : "Log Time Entry"}
        </Button>
      </form>

      {/* Logs list */}
      {timelogs?.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
          <Clock className="h-7 w-7 mb-2 text-zinc-700" />
          <span className="text-xs font-semibold">No time entries</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">
            Work hours have not been recorded on this task yet.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs px-1 text-zinc-400 font-semibold uppercase tracking-wider">
            <span>Time Card History</span>
            <span className="text-emerald-400">
              Total:{" "}
              {timelogs?.reduce(
                (acc: number, log: any) => acc + (log.hours || 0),
                0,
              )}{" "}
              hrs
            </span>
          </div>

          <div className="space-y-2">
            {timelogs?.map((log: any) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/20 text-xs gap-3"
              >
                <div className="flex items-center gap-3">
                  {log.user?.profileImg ? (
                    <Image
                      height={28}
                      width={28}
                      src={log.user.profileImg}
                      alt={log.user.name}
                      className="h-7 w-7 rounded-full object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold border border-zinc-750 text-zinc-300">
                      {log.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h6 className="font-bold text-zinc-200 leading-none">
                      {log.user?.name}
                    </h6>
                    <span className="text-[10px] text-zinc-500 leading-none block mt-1">
                      {log.description || "No description"}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-zinc-200 block">
                    {log.hours} hrs
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-1">
                    {formatDate(log.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
