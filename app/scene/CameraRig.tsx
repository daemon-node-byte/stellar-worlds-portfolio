"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ScrollProgressRef } from "./sceneTypes";

const cameraStops = [
  { position: [0.2, 0.1, 11], target: [4.1, 0.1, -7.2] },
  { position: [0.1, -14.6, 10.5], target: [-4.1, -14.8, -8.4] },
  { position: [-0.2, -29.4, 13], target: [4.9, -29.3, -10.5] },
  { position: [0.4, -44.3, 11], target: [-4.5, -44.5, -8.8] },
  { position: [-0.2, -59.2, 12], target: [3.2, -59.2, -9] },
] as const;

type CameraRigProps = {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
};

export function CameraRig({
  progressRef,
  reducedMotion,
}: CameraRigProps) {
  const lookAt = useRef(new THREE.Vector3(...cameraStops[0].target));
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const endPosition = useMemo(() => new THREE.Vector3(), []);
  const endTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const travel = progressRef.current * (cameraStops.length - 1);
    const startIndex = Math.min(Math.floor(travel), cameraStops.length - 1);
    const endIndex = Math.min(startIndex + 1, cameraStops.length - 1);
    const rawMix = travel - startIndex;
    const mix = rawMix * rawMix * (3 - 2 * rawMix);
    const start = cameraStops[startIndex];
    const end = cameraStops[endIndex];

    desiredPosition
      .set(start.position[0], start.position[1], start.position[2])
      .lerp(
        endPosition.set(end.position[0], end.position[1], end.position[2]),
        mix,
      );
    desiredTarget
      .set(start.target[0], start.target[1], start.target[2])
      .lerp(endTarget.set(end.target[0], end.target[1], end.target[2]), mix);

    if (!reducedMotion) {
      desiredPosition.x += state.pointer.x * 0.2;
      desiredPosition.y += state.pointer.y * 0.12;
    }

    const damping = reducedMotion ? 18 : 4.2;
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      desiredPosition.x,
      damping,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      desiredPosition.y,
      damping,
      delta,
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      desiredPosition.z,
      damping,
      delta,
    );
    lookAt.current.lerp(desiredTarget, 1 - Math.exp(-delta * damping));
    state.camera.lookAt(lookAt.current);
  });

  return null;
}
