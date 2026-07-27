import type { Vector3 } from "three";

export type SunwardCameraOffset = {
  bodyPosition: Vector3;
  bodyTangent: Vector3;
  radius: number;
  trailing: number;
  sunward: number;
  height: number;
};

/**
 * Positions a close-up camera toward the star-facing hemisphere while keeping
 * enough orbital trailing distance for a dimensional three-quarter view.
 */
export function calculateSunwardCameraOffset(
  landing: SunwardCameraOffset,
  radialDirection: Vector3,
  output: Vector3,
) {
  radialDirection.copy(landing.bodyPosition);
  if (radialDirection.lengthSq() < 0.0001) {
    radialDirection.set(1, 0, 0);
  } else {
    radialDirection.normalize();
  }

  output
    .copy(landing.bodyTangent)
    .multiplyScalar(-landing.radius * landing.trailing)
    .addScaledVector(
      radialDirection,
      -landing.radius * landing.sunward,
    );
  output.y += landing.radius * landing.height;

  return output;
}
