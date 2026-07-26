export type CameraOrbitMotion = {
  orbitArc: number;
  orbitSpeed: number;
  orbitPhase: number;
};

export function calculateCameraOrbitAngle(
  elapsedTime: number,
  motion: CameraOrbitMotion,
  reducedMotion: boolean,
) {
  if (reducedMotion) return 0;

  return (
    Math.sin(elapsedTime * motion.orbitSpeed + motion.orbitPhase) *
    motion.orbitArc
  );
}
