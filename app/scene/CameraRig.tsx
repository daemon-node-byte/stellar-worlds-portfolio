"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
  OrbitalTargetRegistry,
  PlanetId,
  ScrollProgressRef,
} from "./sceneTypes";

type OverviewCameraStop = {
  id: "overview";
  progress: number;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
};

type PlanetCameraStop = {
  id: PlanetId;
  progress: number;
  trailing: number;
  radial: number;
  height: number;
  fov: number;
};

type CameraStop = OverviewCameraStop | PlanetCameraStop;

const cameraStops: readonly CameraStop[] = [
  {
    id: "overview",
    progress: 0,
    position: [0, 54, 72],
    target: [0, 0, 0],
    fov: 52,
  },
  {
    id: "signal",
    progress: 0.12,
    trailing: 4.8,
    radial: 3.4,
    height: 1.1,
    fov: 44,
  },
  {
    id: "virelia",
    progress: 0.3,
    trailing: 5.4,
    radial: 3.8,
    height: 1.35,
    fov: 44,
  },
  {
    id: "khepri",
    progress: 0.5,
    trailing: 5.1,
    radial: 3.4,
    height: 1.2,
    fov: 43,
  },
  {
    id: "calyx",
    progress: 0.75,
    trailing: 5.8,
    radial: 4.1,
    height: 1.5,
    fov: 43,
  },
  {
    id: "nox",
    progress: 1,
    trailing: 5,
    radial: 3.5,
    height: 1.15,
    fov: 43,
  },
] as const;

function resolveCameraStop(
  stop: CameraStop,
  targets: OrbitalTargetRegistry,
  position: THREE.Vector3,
  lookTarget: THREE.Vector3,
  radialDirection: THREE.Vector3,
) {
  if (stop.id === "overview") {
    position.set(...stop.position);
    lookTarget.set(...stop.target);
    return;
  }

  const body = targets[stop.id];
  radialDirection.copy(body.position);
  if (radialDirection.lengthSq() < 0.0001) {
    radialDirection.set(1, 0, 0);
  } else {
    radialDirection.normalize();
  }

  position
    .copy(body.position)
    .addScaledVector(body.tangent, -body.radius * stop.trailing)
    .addScaledVector(radialDirection, body.radius * stop.radial);
  position.y += body.radius * stop.height;

  lookTarget
    .copy(body.position)
    .addScaledVector(body.tangent, body.radius * 0.14);
}

type CameraRigProps = {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
  targets: OrbitalTargetRegistry;
};

export function CameraRig({
  progressRef,
  reducedMotion,
  targets,
}: CameraRigProps) {
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const startPosition = useMemo(() => new THREE.Vector3(), []);
  const startTarget = useMemo(() => new THREE.Vector3(), []);
  const startRadial = useMemo(() => new THREE.Vector3(), []);
  const endPosition = useMemo(() => new THREE.Vector3(), []);
  const endTarget = useMemo(() => new THREE.Vector3(), []);
  const endRadial = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const nextStopIndex = cameraStops.findIndex(
      (stop) => progress <= stop.progress,
    );
    const endIndex =
      nextStopIndex === -1 ? cameraStops.length - 1 : nextStopIndex;
    const startIndex = Math.max(0, endIndex - 1);
    const start = cameraStops[startIndex];
    const end = cameraStops[endIndex];
    const progressRange = Math.max(end.progress - start.progress, 0.0001);
    const rawMix = THREE.MathUtils.clamp(
      (progress - start.progress) / progressRange,
      0,
      1,
    );
    const mix = rawMix * rawMix * (3 - 2 * rawMix);

    resolveCameraStop(
      start,
      targets,
      startPosition,
      startTarget,
      startRadial,
    );
    resolveCameraStop(end, targets, endPosition, endTarget, endRadial);
    desiredPosition.copy(startPosition).lerp(endPosition, mix);
    desiredTarget.copy(startTarget).lerp(endTarget, mix);

    if (!reducedMotion) {
      desiredPosition.x += state.pointer.x * 0.28;
      desiredPosition.y += state.pointer.y * 0.18;
    }

    const damping = reducedMotion ? 18 : 5;
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

    if (state.camera instanceof THREE.PerspectiveCamera) {
      const desiredFov = THREE.MathUtils.lerp(start.fov, end.fov, mix);
      const nextFov = THREE.MathUtils.damp(
        state.camera.fov,
        desiredFov,
        damping,
        delta,
      );
      if (Math.abs(nextFov - state.camera.fov) > 0.001) {
        state.camera.fov = nextFov;
        state.camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
