"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Shared lifecycle states for short, user-triggered interface sequences. */
export type TimedInteractionStatus = "idle" | "running" | "complete";

type TimedInteractionOptions = {
  duration: number;
  reducedMotion: boolean;
  reducedMotionDuration?: number;
};

/**
 * Runs a cancellable interaction sequence without leaking timers.
 * Usage: scanners, decoders, and beacons call start and reset explicitly.
 */
export function useTimedInteraction({
  duration,
  reducedMotion,
  reducedMotionDuration = 40,
}: TimedInteractionOptions) {
  const timerRef = useRef(0);
  const [status, setStatus] = useState<TimedInteractionStatus>("idle");

  const clearTimer = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    setStatus("running");
    timerRef.current = window.setTimeout(
      () => {
        timerRef.current = 0;
        setStatus("complete");
      },
      reducedMotion ? reducedMotionDuration : duration,
    );
  }, [
    clearTimer,
    duration,
    reducedMotion,
    reducedMotionDuration,
  ]);

  useEffect(() => clearTimer, [clearTimer]);

  return {
    reset,
    start,
    status,
  } as const;
}
