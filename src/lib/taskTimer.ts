const STORAGE_KEY = "mpms_task_timers";

export interface TaskTimerState {
  taskId: string;
  userId: string;
  accumulatedMs: number;
  sessionStartMs: number | null;
}

function readAll(): Record<string, TaskTimerState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, TaskTimerState>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function storageKey(taskId: string, userId: string) {
  return `${userId}:${taskId}`;
}

export function getTaskTimerState(
  taskId: string,
  userId: string
): TaskTimerState | null {
  const all = readAll();
  return all[storageKey(taskId, userId)] ?? null;
}

export function saveTaskTimerState(state: TaskTimerState) {
  const all = readAll();
  all[storageKey(state.taskId, state.userId)] = state;
  writeAll(all);
}

export function clearTaskTimerState(taskId: string, userId: string) {
  const all = readAll();
  delete all[storageKey(taskId, userId)];
  writeAll(all);
}

export function initTaskTimerFromServer(
  taskId: string,
  userId: string,
  workStartedAt?: string | null
) {
  const existing = getTaskTimerState(taskId, userId);
  if (existing) return existing;

  if (!workStartedAt) return null;

  const state: TaskTimerState = {
    taskId,
    userId,
    accumulatedMs: 0,
    sessionStartMs: new Date(workStartedAt).getTime(),
  };
  saveTaskTimerState(state);
  return state;
}

export function resumeTaskTimer(taskId: string, userId: string) {
  const state = getTaskTimerState(taskId, userId);
  if (!state) return null;

  if (state.sessionStartMs === null) {
    state.sessionStartMs = Date.now();
    saveTaskTimerState(state);
  }
  return state;
}

export function pauseTaskTimer(taskId: string, userId: string) {
  const state = getTaskTimerState(taskId, userId);
  if (!state) return 0;

  if (state.sessionStartMs !== null) {
    state.accumulatedMs += Date.now() - state.sessionStartMs;
    state.sessionStartMs = null;
    saveTaskTimerState(state);
  }

  return state.accumulatedMs;
}

export function isTaskTimerPaused(taskId: string, userId: string): boolean {
  const state = getTaskTimerState(taskId, userId);
  if (!state) return false;
  return state.sessionStartMs === null;
}

export function getElapsedMs(taskId: string, userId: string): number {
  const state = getTaskTimerState(taskId, userId);
  if (!state) return 0;

  if (state.sessionStartMs !== null) {
    return state.accumulatedMs + (Date.now() - state.sessionStartMs);
  }
  return state.accumulatedMs;
}

export function getElapsedSeconds(taskId: string, userId: string): number {
  return Math.floor(getElapsedMs(taskId, userId) / 1000);
}

export function formatElapsedTime(totalMs: number): string {
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
