"use client";

import { useMemo, useState } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  GodRays,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { OrbitalPlanet } from "./OrbitalPlanet";
import {
  planetDefinitions,
  type SolarPlanetDefinition,
} from "./solarSystemConfig";
import { SolarEntity } from "./SolarEntity";
import { StarField } from "./StarField";
import type {
  OrbitalTarget,
  OrbitalTargetRegistry,
  ScrollProgressRef,
} from "./sceneTypes";

function createOrbitalTarget(
  definition: SolarPlanetDefinition,
): OrbitalTarget {
  return {
    position: new THREE.Vector3(),
    tangent: new THREE.Vector3(0, 0, 1),
    radius: definition.radius,
  };
}

type SpaceSceneProps = {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
};

type SolarPostProcessingProps = {
  godRaysSource: THREE.Mesh | null;
};

function SolarPostProcessing({
  godRaysSource,
}: SolarPostProcessingProps) {
  if (!godRaysSource) return null;

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <GodRays
        sun={godRaysSource}
        samples={32}
        density={0.9}
        decay={0.91}
        weight={0.2}
        exposure={0.32}
        clampMax={0.68}
        resolutionScale={0.4}
        blur
      />
      <Bloom
        intensity={0.84}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.72}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0004, 0.0003)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.13} />
      <Vignette eskil={false} offset={0.12} darkness={0.72} />
    </EffectComposer>
  );
}

export function SpaceScene({
  progressRef,
  reducedMotion,
}: SpaceSceneProps) {
  const [godRaysSource, setGodRaysSource] =
    useState<THREE.Mesh | null>(null);
  const orbitalTargets = useMemo<OrbitalTargetRegistry>(
    () => ({
      signal: createOrbitalTarget(planetDefinitions[0]),
      virelia: createOrbitalTarget(planetDefinitions[1]),
      khepri: createOrbitalTarget(planetDefinitions[2]),
      calyx: createOrbitalTarget(planetDefinitions[3]),
      nox: createOrbitalTarget(planetDefinitions[4]),
    }),
    [],
  );

  return (
    <>
      <color attach="background" args={["#030807"]} />
      <fog attach="fog" args={["#030807", 62, 145]} />
      <ambientLight color="#9ba38f" intensity={0.07} />
      <hemisphereLight args={["#7e8871", "#020303", 0.1]} />

      <StarField />
      <SolarEntity onGodRaysSourceChange={setGodRaysSource} />
      {planetDefinitions.map((definition) => (
        <OrbitalPlanet
          definition={definition}
          reducedMotion={reducedMotion}
          target={orbitalTargets[definition.id]}
          key={definition.id}
        />
      ))}

      <CameraRig
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        targets={orbitalTargets}
      />

      <SolarPostProcessing godRaysSource={godRaysSource} />
    </>
  );
}
