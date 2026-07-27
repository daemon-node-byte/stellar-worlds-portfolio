/** A normalized point within the skills map. */
export type ConstellationPoint = {
  x: number;
  y: number;
};

/** Render-ready line geometry measured in degrees and map-width percentage. */
export type ConstellationConnection = {
  angle: number;
  length: number;
};

/** The visual center of the full-stack skill system, in percentage units. */
export const skillConstellationCenter: ConstellationPoint = { x: 50, y: 48 };

/** Matches the fixed CSS aspect ratio used by the constellation map. */
export const skillConstellationAspectRatio = 1.65;

/**
 * Calculates a line from the constellation core to a normalized skill point.
 * The y-axis is corrected for the map's non-square aspect ratio.
 */
export function calculateConstellationConnection(
  target: ConstellationPoint,
  center = skillConstellationCenter,
  aspectRatio = skillConstellationAspectRatio,
): ConstellationConnection {
  if (aspectRatio <= 0) {
    throw new RangeError("Constellation aspect ratio must be positive.");
  }

  const deltaX = target.x - center.x;
  const deltaY = (target.y - center.y) / aspectRatio;

  return {
    angle: (Math.atan2(deltaY, deltaX) * 180) / Math.PI,
    length: Math.hypot(deltaX, deltaY),
  };
}
