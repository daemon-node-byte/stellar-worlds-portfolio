"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
  OrbitalTargetRegistry,
  PlanetId,
  ScrollProgressRef,
} from "./sceneTypes";
import {
  calculateCameraOrbitAngle,
  type CameraOrbitMotion,
} from "./cameraOrbitMath";
import { calculateSunwardCameraOffset } from "./cameraLandingMath";

type OverviewCameraStop = {
  id: "overview";
  progress: number;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
};

type PlanetCameraStop = CameraOrbitMotion & {
  id: PlanetId;
  progress: number;
  trailing: number;
  sunward: number;
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
    progress: 0.1,
    trailing: 4.8,
    sunward: 3.4,
    height: 1.1,
    fov: 44,
    orbitArc: 0.18,
    orbitSpeed: 0.12,
    orbitPhase: 0,
  },
  {
    id: "virelia",
    progress: 0.25,
    trailing: 5.4,
    sunward: 3.8,
    height: 1.35,
    fov: 44,
    orbitArc: 0.22,
    orbitSpeed: 0.1,
    orbitPhase: 1.1,
  },
  {
    id: "khepri",
    progress: 0.5,
    trailing: 5.1,
    sunward: 3.4,
    height: 1.2,
    fov: 43,
    orbitArc: 0.16,
    orbitSpeed: 0.09,
    orbitPhase: 2.3,
  },
  {
    id: "calyx",
    progress: 0.75,
    trailing: 5.8,
    sunward: 4.1,
    height: 1.5,
    fov: 43,
    orbitArc: 0.2,
    orbitSpeed: 0.11,
    orbitPhase: 0.6,
  },
  {
    id: "nox",
    progress: 1,
    trailing: 5,
    sunward: 3.5,
    height: 1.15,
    fov: 43,
    orbitArc: 0.18,
    orbitSpeed: 0.08,
    orbitPhase: 1.8,
  },
] as const;

function resolveCameraStop(
  stop: CameraStop,
  targets: OrbitalTargetRegistry,
  position: THREE.Vector3,
  lookTarget: THREE.Vector3,
  radialDirection: THREE.Vector3,
  cameraOffset: THREE.Vector3,
  elapsedTime: number,
  reducedMotion: boolean,
) {
  if (stop.id === "overview") {
    position.set(...stop.position);
    lookTarget.set(...stop.target);
    return;
  }

  const body = targets[stop.id];
  calculateSunwardCameraOffset(
    {
      bodyPosition: body.position,
      bodyTangent: body.tangent,
      radius: body.radius,
      trailing: stop.trailing,
      sunward: stop.sunward,
      height: stop.height,
    },
    radialDirection,
    cameraOffset,
  );
  cameraOffset.applyAxisAngle(
    THREE.Object3D.DEFAULT_UP,
    calculateCameraOrbitAngle(elapsedTime, stop, reducedMotion),
  );
  position.copy(body.position).add(cameraOffset);

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
  const startOffset = useMemo(() => new THREE.Vector3(), []);
  const endPosition = useMemo(() => new THREE.Vector3(), []);
  const endTarget = useMemo(() => new THREE.Vector3(), []);
  const endRadial = useMemo(() => new THREE.Vector3(), []);
  const endOffset = useMemo(() => new THREE.Vector3(), []);

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
      startOffset,
      state.clock.elapsedTime,
      reducedMotion,
    );
    resolveCameraStop(
      end,
      targets,
      endPosition,
      endTarget,
      endRadial,
      endOffset,
      state.clock.elapsedTime,
      reducedMotion,
    );
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
