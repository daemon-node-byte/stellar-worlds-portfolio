"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { SpaceScene } from "../scene/SpaceScene";
import type { ScrollProgressRef } from "../scene/sceneTypes";

type SceneCanvasProps = {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
};

export function SceneCanvas({
  progressRef,
  reducedMotion,
}: SceneCanvasProps) {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0.2, 0.1, 11], fov: 45, near: 0.1, far: 180 }}
        dpr={[1, 1.5]}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.96;
        }}
        fallback={
          <div className="scene-fallback">
            Your browser is showing the reduced visual experience.
          </div>
        }
      >
        <Suspense fallback={null}>
          <SpaceScene
            progressRef={progressRef}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
