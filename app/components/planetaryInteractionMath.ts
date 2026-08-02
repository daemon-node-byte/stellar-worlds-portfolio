/** Normalized coordinates within the communications target. */
export type BeaconAim = {
  x: number;
  y: number;
};

/** Pixel bounds used to translate a pointer location into beacon coordinates. */
export type BeaconTargetBounds = {
  height: number;
  left: number;
  top: number;
  width: number;
};

/** Supported keyboard movement directions for the beacon crosshair. */
export type BeaconAimDirection = "up" | "right" | "down" | "left";

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

/**
 * Converts a pointer location into normalized coordinates within the beacon.
 */
export function calculateBeaconAim(
  clientX: number,
  clientY: number,
  bounds: BeaconTargetBounds,
): BeaconAim {
  if (bounds.width <= 0 || bounds.height <= 0) {
    return { x: 50, y: 50 };
  }

  return {
    x: clampPercentage(((clientX - bounds.left) / bounds.width) * 100),
    y: clampPercentage(((clientY - bounds.top) / bounds.height) * 100),
  };
}

/**
 * Moves keyboard-controlled beacon coordinates while preserving map bounds.
 */
export function nudgeBeaconAim(
  aim: BeaconAim,
  direction: BeaconAimDirection,
  step = 4,
): BeaconAim {
  const delta = Math.max(0, step);

  switch (direction) {
    case "up":
      return { x: aim.x, y: clampPercentage(aim.y - delta) };
    case "right":
      return { x: clampPercentage(aim.x + delta), y: aim.y };
    case "down":
      return { x: aim.x, y: clampPercentage(aim.y + delta) };
    case "left":
      return { x: clampPercentage(aim.x - delta), y: aim.y };
  }
}
