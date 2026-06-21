/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearTaskTimerState,
  formatElapsedTime,
  getElapsedMs,
  getTaskTimerState,
  initTaskTimerFromServer,
  isTaskTimerPaused,
  pauseTaskTimer,
  resumeTaskTimer,
  saveTaskTimerState,
} from "@/lib/taskTimer";

interface UseTaskTimerOptions {
  taskId: string;
  userId: string;
  status: string;
  workStartedAt?: string | null;
}

export function useTaskTimer({
  taskId,
  userId,
  status,
  workStartedAt,
}: UseTaskTimerOptions) {
  const [display, setDisplay] = useState("00:00:00");
  const [isPaused, setIsPaused] = useState(false);

  const isRunning = status === "In Progress";

  const syncDisplay = useCallback(() => {
    setDisplay(formatElapsedTime(getElapsedMs(taskId, userId)));
    setIsPaused(isTaskTimerPaused(taskId, userId));
  }, [taskId, userId]);

  useEffect(() => {
    if (!isRunning) {
      syncDisplay();
      return;
    }

    initTaskTimerFromServer(taskId, userId, workStartedAt);
    syncDisplay();
  }, [taskId, userId, workStartedAt, isRunning, syncDisplay]);

  useEffect(() => {
    if (!isRunning || isPaused) {
      syncDisplay();
      return;
    }

    const interval = setInterval(syncDisplay, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isPaused, syncDisplay]);

  const startTimer = useCallback(() => {
    const state = getTaskTimerState(taskId, userId);
    if (!state) {
      saveTaskTimerState({
        taskId,
        userId,
        accumulatedMs: 0,
        sessionStartMs: Date.now(),
      });
      setIsPaused(false);
    } else {
      resumeTaskTimer(taskId, userId);
      setIsPaused(false);
    }
    syncDisplay();
  }, [taskId, userId, syncDisplay]);

  const pauseTimer = useCallback(() => {
    pauseTaskTimer(taskId, userId);
    setIsPaused(true);
    syncDisplay();
  }, [taskId, userId, syncDisplay]);

  const resumeTimer = useCallback(() => {
    resumeTaskTimer(taskId, userId);
    setIsPaused(false);
    syncDisplay();
  }, [taskId, userId, syncDisplay]);

  const pauseAndGetSeconds = useCallback(() => {
    pauseTaskTimer(taskId, userId);
    const seconds = Math.floor(getElapsedMs(taskId, userId) / 1000);
    clearTaskTimerState(taskId, userId);
    setIsPaused(false);
    syncDisplay();
    return seconds;
  }, [taskId, userId, syncDisplay]);

  return {
    display,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    pauseAndGetSeconds,
    syncDisplay,
  };
}
