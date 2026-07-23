"use client";

import { useMemo } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { OrbitalDebris } from "./OrbitalDebris";
import { Planet } from "./Planet";
import { StarField } from "./StarField";
import type { PlanetPalette, ScrollProgressRef } from "./sceneTypes";

const palettes: Record<string, PlanetPalette> = {
  signal: {
    low: "#07100d",
    mid: "#31462a",
    high: "#9dad55",
    accent: "#d8ff45",
    atmosphere: "#c6ff68",
  },
  virelia: {
    low: "#07141a",
    mid: "#174b49",
    high: "#73a995",
    accent: "#ffb35c",
    atmosphere: "#6dfbd4",
  },
  khepri: {
    low: "#120b08",
    mid: "#4d2519",
    high: "#bd7650",
    accent: "#ffb35c",
    atmosphere: "#ff8a4c",
  },
  calyx: {
    low: "#090b16",
    mid: "#262c52",
    high: "#7988b3",
    accent: "#d8ff45",
    atmosphere: "#a8c5ff",
  },
  nox: {
    low: "#070707",
    mid: "#26231e",
    high: "#777161",
    accent: "#d8ff45",
    atmosphere: "#e6ff95",
  },
};

type SpaceSceneProps = {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
};

export function SpaceScene({
  progressRef,
  reducedMotion,
}: SpaceSceneProps) {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.00045, 0.00035), []);

  return (
    <>
      <color attach="background" args={["#030807"]} />
      <fog attach="fog" args={["#030807", 18, 78]} />
      <ambientLight color="#b7c6a3" intensity={0.22} />
      <hemisphereLight args={["#9abf94", "#020303", 0.32]} />
      <directionalLight
        castShadow
        color="#ffb35c"
        intensity={4.2}
        position={[12, 8, 13]}
        shadow-mapSize={[1536, 1536]}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0002}
      />
      <pointLight
        color="#d8ff45"
        intensity={18}
        distance={34}
        decay={2}
        position={[-9, -30, 0]}
      />
      <pointLight
        color="#87c7ff"
        intensity={14}
        distance={30}
        decay={2}
        position={[8, -47, -2]}
      />

      <StarField />
      <Planet
        position={[4.1, 0.1, -7.2]}
        radius={3.4}
        seed={1.4}
        palette={palettes.signal}
        albedoMap="/textures/planets/signal-albedo.jpg"
        heightMap="/textures/planets/signal-height.jpg"
        rotationSpeed={0.026}
        moon
      />
      <Planet
        position={[-4.1, -14.8, -8.4]}
        radius={3.15}
        seed={2.8}
        palette={palettes.virelia}
        albedoMap="/textures/planets/virelia-albedo.jpg"
        heightMap="/textures/planets/virelia-height.jpg"
        rotationSpeed={0.021}
        ring
      />
      <Planet
        position={[4.9, -29.3, -10.5]}
        radius={4.15}
        seed={5.2}
        palette={palettes.khepri}
        albedoMap="/textures/planets/khepri-albedo.jpg"
        heightMap="/textures/planets/khepri-height.jpg"
        rotationSpeed={0.017}
        moon
      />
      <OrbitalDebris
        position={[4.9, -29.3, -10.5]}
        radius={6.2}
        color="#96735c"
      />
      <Planet
        position={[-4.5, -44.5, -8.8]}
        radius={2.9}
        seed={8.6}
        palette={palettes.calyx}
        albedoMap="/textures/planets/calyx-albedo.jpg"
        heightMap="/textures/planets/calyx-height.jpg"
        rotationSpeed={0.034}
        ring
      />
      <Planet
        position={[3.2, -59.2, -9]}
        radius={3.8}
        seed={13.1}
        palette={palettes.nox}
        albedoMap="/textures/planets/nox-albedo.jpg"
        heightMap="/textures/planets/nox-height.jpg"
        rotationSpeed={0.015}
      />

      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />

      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom
          intensity={0.82}
          luminanceThreshold={0.62}
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
