"use client";

import { useMemo, useRef } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  GodRays,
  LensFlare,
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

export function SpaceScene({
  progressRef,
  reducedMotion,
}: SpaceSceneProps) {
  const godRaysSource = useRef<THREE.Mesh>(null!);
  const chromaticOffset = useMemo(
    () => new THREE.Vector2(0.0004, 0.0003),
    [],
  );
  const solarPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const flareColor = useMemo(
    () => new THREE.Color(8.5, 5.4, 2.4),
    [],
  );
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
      <SolarEntity godRaysSourceRef={godRaysSource} />
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

      <EffectComposer enableNormalPass={false} multisampling={0}>
        <GodRays
          sun={godRaysSource}
          samples={48}
          density={0.91}
          decay={0.92}
          weight={0.22}
          exposure={0.36}
          clampMax={0.72}
          resolutionScale={0.5}
          blur
        />
        <LensFlare
          lensPosition={solarPosition}
          glareSize={0.085}
          flareSize={0.012}
          flareSpeed={reducedMotion ? 0 : 0.008}
          flareShape={0.12}
          starPoints={8}
          animated={!reducedMotion}
          anamorphic
          colorGain={flareColor}
          haloScale={0.42}
          secondaryGhosts
          aditionalStreaks
          ghostScale={0.14}
          starBurst
          smoothTime={0.1}
        />
        <Bloom
          intensity={0.88}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.72}
          mipmapBlur
        />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.13} />
        <Vignette eskil={false} offset={0.12} darkness={0.72} />
      </EffectComposer>
    </>
  );
}
