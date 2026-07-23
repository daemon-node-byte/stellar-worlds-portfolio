"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPlanetTextures } from "./createPlanetTextures";
import type { PlanetPalette } from "./sceneTypes";

const atmosphereVertexShader = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.2);
    gl_FragColor = vec4(glowColor, fresnel * intensity);
  }
`;

type PlanetProps = {
  position: [number, number, number];
  radius: number;
  seed: number;
  palette: PlanetPalette;
  rotationSpeed?: number;
  ring?: boolean;
  moon?: boolean;
};

export function Planet({
  position,
  radius,
  seed,
  palette,
  rotationSpeed = 0.025,
  ring = false,
  moon = false,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const textures = useMemo(
    () => createPlanetTextures(seed, palette),
    [palette, seed],
  );
  const atmosphereUniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(palette.atmosphere) },
      intensity: { value: 0.72 },
    }),
    [palette.atmosphere],
  );

  useEffect(
    () => () => {
      textures.colorMap.dispose();
      textures.heightMap.dispose();
    },
    [textures],
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.09 + seed) * 0.025;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y -= delta * rotationSpeed * 0.38;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow receiveShadow rotation={[0.12, 0, -0.08]}>
        <sphereGeometry args={[radius, 112, 112]} />
        <meshStandardMaterial
          map={textures.colorMap}
          bumpMap={textures.heightMap}
          bumpScale={radius * 0.065}
          displacementMap={textures.heightMap}
          displacementScale={radius * 0.07}
          displacementBias={-radius * 0.022}
          roughness={0.82}
          metalness={0.08}
          envMapIntensity={0.35}
        />
      </mesh>

      <mesh
        ref={cloudRef}
        scale={1.018}
        rotation={[0.08, seed * 0.12, 0]}
      >
        <sphereGeometry args={[radius, 72, 72]} />
        <meshBasicMaterial
          map={textures.colorMap}
          color={palette.atmosphere}
          transparent
          opacity={0.075}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.085}>
        <sphereGeometry args={[radius, 72, 72]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {ring ? (
        <mesh rotation={[Math.PI * 0.38, 0.25, 0.06]} receiveShadow>
          <ringGeometry args={[radius * 1.32, radius * 2.05, 160]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.18}
            side={THREE.DoubleSide}
            transparent
            opacity={0.28}
            roughness={0.9}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {moon ? (
        <group rotation={[0.35, 0.1, 0.55]}>
          <mesh castShadow position={[radius * 1.75, 0, 0]}>
            <icosahedronGeometry args={[radius * 0.16, 3]} />
            <meshStandardMaterial
              color={palette.high}
              roughness={0.92}
              bumpMap={textures.heightMap}
              bumpScale={0.035}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 1.75, 0.006, 6, 180]} />
            <meshBasicMaterial
              color={palette.accent}
              transparent
              opacity={0.18}
            />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
