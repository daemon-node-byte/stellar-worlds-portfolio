"use client";

import { useEffect, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MoonSurface } from "./sceneTypes";

type MoonProps = {
  orbitRadius: number;
  orbitColor: string;
  radius: number;
  surface: MoonSurface;
};

export function Moon({
  orbitRadius,
  orbitColor,
  radius,
  surface,
}: MoonProps) {
  const moonRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const [albedoTexture, heightTexture] = useLoader(THREE.TextureLoader, [
    surface.albedoMap,
    surface.heightMap,
  ]);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    albedoTexture.colorSpace = THREE.SRGBColorSpace;
    albedoTexture.wrapS = THREE.RepeatWrapping;
    albedoTexture.wrapT = THREE.ClampToEdgeWrapping;
    albedoTexture.anisotropy = Math.min(8, maxAnisotropy);
    albedoTexture.needsUpdate = true;

    heightTexture.colorSpace = THREE.NoColorSpace;
    heightTexture.wrapS = THREE.RepeatWrapping;
    heightTexture.wrapT = THREE.ClampToEdgeWrapping;
    heightTexture.anisotropy = Math.min(4, maxAnisotropy);
    heightTexture.needsUpdate = true;
  }, [albedoTexture, gl, heightTexture]);

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <group rotation={[0.35, 0.1, 0.55]}>
      <mesh
        ref={moonRef}
        castShadow
        receiveShadow
        position={[orbitRadius, 0, 0]}
        rotation={[0.14, 0, -0.08]}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={albedoTexture}
          bumpMap={heightTexture}
          bumpScale={radius * 0.09}
          displacementMap={heightTexture}
          displacementScale={radius * 0.07}
          displacementBias={-radius * 0.015}
          roughness={0.94}
          metalness={0.02}
          envMapIntensity={0.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.006, 6, 180]} />
        <meshBasicMaterial
          color={orbitColor}
          transparent
          opacity={0.13}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
