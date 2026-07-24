"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Moon } from "./Moon";
import { RingSystem } from "./RingSystem";
import type { MoonSurface, PlanetPalette } from "./sceneTypes";

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
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.4);
    gl_FragColor = vec4(glowColor, fresnel * intensity);
  }
`;

type PlanetProps = {
  position: [number, number, number];
  radius: number;
  seed: number;
  palette: PlanetPalette;
  albedoMap: string;
  heightMap: string;
  rotationSpeed?: number;
  ring?: boolean;
  moon?: MoonSurface;
};

export function Planet({
  position,
  radius,
  seed,
  palette,
  albedoMap,
  heightMap,
  rotationSpeed = 0.025,
  ring = false,
  moon,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const [surfaceTexture, terrainTexture] = useLoader(THREE.TextureLoader, [
    albedoMap,
    heightMap,
  ]);
  const atmosphereUniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(palette.atmosphere) },
      intensity: { value: 0.27 },
    }),
    [palette.atmosphere],
  );

  useEffect(
    () => {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      surfaceTexture.colorSpace = THREE.SRGBColorSpace;
      surfaceTexture.wrapS = THREE.RepeatWrapping;
      surfaceTexture.wrapT = THREE.ClampToEdgeWrapping;
      surfaceTexture.anisotropy = Math.min(8, maxAnisotropy);
      surfaceTexture.needsUpdate = true;

      terrainTexture.colorSpace = THREE.NoColorSpace;
      terrainTexture.wrapS = THREE.RepeatWrapping;
      terrainTexture.wrapT = THREE.ClampToEdgeWrapping;
      terrainTexture.anisotropy = Math.min(4, maxAnisotropy);
      terrainTexture.needsUpdate = true;
    },
    [gl, surfaceTexture, terrainTexture],
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
          map={surfaceTexture}
          bumpMap={terrainTexture}
          bumpScale={radius * 0.072}
          displacementMap={terrainTexture}
          displacementScale={radius * 0.082}
          displacementBias={-radius * 0.012}
          roughness={0.82}
          metalness={0.08}
          envMapIntensity={0.35}
        />
      </mesh>

      <mesh
        ref={cloudRef}
        scale={1.012}
        rotation={[0.08, seed * 0.12, 0]}
      >
        <sphereGeometry args={[radius, 72, 72]} />
        <meshBasicMaterial
          map={surfaceTexture}
          color={palette.atmosphere}
          transparent
          opacity={0.025}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.055}>
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
        <RingSystem
          radius={radius}
          seed={seed}
          baseColor={palette.high}
          dustColor={palette.accent}
        />
      ) : null}

      {moon ? (
        <Moon
          orbitRadius={radius * 1.75}
          orbitColor={palette.accent}
          radius={radius * 0.16}
          surface={moon}
        />
      ) : null}
    </group>
  );
}
