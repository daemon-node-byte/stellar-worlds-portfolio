"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { solarRadius } from "./solarSystemConfig";

type SolarEntityProps = {
  onGodRaysSourceChange: (source: THREE.Mesh | null) => void;
};

const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFragmentShader = `
  uniform vec3 coronaColor;
  uniform float time;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float fresnel = pow(
      1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))),
      2.35
    );
    float turbulence =
      0.78 +
      sin(vPosition.y * 7.0 + time * 0.48) * 0.11 +
      sin(vPosition.x * 11.0 - time * 0.31) * 0.08;
    gl_FragColor = vec4(coronaColor, fresnel * turbulence * 0.34);
  }
`;

function seededRandom(index: number) {
  const value = Math.sin(index * 73.187 + 19.117) * 43758.5453;
  return value - Math.floor(value);
}

function createGlareTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const normalizedX = (x / (size - 1)) * 2 - 1;
      const normalizedY = (y / (size - 1)) * 2 - 1;
      const distance = Math.sqrt(
        normalizedX * normalizedX + normalizedY * normalizedY,
      );
      const edge = Math.max(0, 1 - distance);
      const core = Math.pow(edge, 5);
      const halo = Math.pow(edge, 1.8) * 0.42;
      const alpha = Math.min(1, core + halo);
      const offset = (y * size + x) * 4;

      data[offset] = 255;
      data[offset + 1] = 239;
      data[offset + 2] = 174;
      data[offset + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function SolarEntity({
  onGodRaysSourceChange,
}: SolarEntityProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const plasmaRef = useRef<THREE.Mesh>(null);
  const coronaDustRef = useRef<THREE.Points>(null);
  const coronaMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const [surfaceTexture, emissionTexture, heightTexture] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/solar/solar-surface-albedo.jpg",
      "/textures/solar/solar-surface-emission.jpg",
      "/textures/solar/solar-surface-height.jpg",
    ],
  );
  const coronaUniforms = useMemo(
    () => ({
      coronaColor: { value: new THREE.Color("#ffd66b") },
      time: { value: 0 },
    }),
    [],
  );
  const glareTexture = useMemo(createGlareTexture, []);
  const coronaParticles = useMemo(() => {
    const particleCount = 720;
    const data = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      const longitude = seededRandom(index) * Math.PI * 2;
      const cosineLatitude = seededRandom(index + particleCount) * 2 - 1;
      const latitudeRadius = Math.sqrt(1 - cosineLatitude * cosineLatitude);
      const shellRadius =
        solarRadius *
        (1.07 + Math.pow(seededRandom(index + particleCount * 2), 2.2) * 0.2);

      data[index * 3] =
        Math.cos(longitude) * latitudeRadius * shellRadius;
      data[index * 3 + 1] = cosineLatitude * shellRadius;
      data[index * 3 + 2] =
        Math.sin(longitude) * latitudeRadius * shellRadius;
    }

    return data;
  }, []);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    for (const texture of [surfaceTexture, emissionTexture]) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.anisotropy = Math.min(8, maxAnisotropy);
      texture.needsUpdate = true;
    }

    heightTexture.colorSpace = THREE.NoColorSpace;
    heightTexture.wrapS = THREE.RepeatWrapping;
    heightTexture.wrapT = THREE.ClampToEdgeWrapping;
    heightTexture.anisotropy = Math.min(4, maxAnisotropy);
    heightTexture.needsUpdate = true;
  }, [emissionTexture, gl, heightTexture, surfaceTexture]);

  useEffect(() => () => glareTexture.dispose(), [glareTexture]);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.018;
      coreRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.018;
    }
    if (plasmaRef.current) {
      plasmaRef.current.rotation.y -= delta * 0.027;
      plasmaRef.current.rotation.x += delta * 0.004;
    }
    if (coronaDustRef.current) {
      coronaDustRef.current.rotation.y += delta * 0.006;
    }
    if (coronaMaterialRef.current) {
      coronaMaterialRef.current.uniforms.time.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <group>
      <pointLight
        castShadow
        color="#ffd18a"
        intensity={760}
        distance={0}
        decay={2}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={105}
        shadow-bias={-0.00055}
        shadow-radius={2}
      />

      <mesh ref={coreRef}>
        <sphereGeometry args={[solarRadius, 128, 128]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive="#ffad42"
          emissiveMap={emissionTexture}
          emissiveIntensity={2.1}
          bumpMap={heightTexture}
          bumpScale={solarRadius * 0.035}
          displacementMap={heightTexture}
          displacementScale={solarRadius * 0.018}
          displacementBias={-solarRadius * 0.006}
          roughness={0.74}
          metalness={0}
        />
      </mesh>

      <mesh
        ref={onGodRaysSourceChange}
        scale={0.975}
      >
        <sphereGeometry args={[solarRadius, 64, 64]} />
        <meshBasicMaterial
          color="#fff0b5"
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={plasmaRef}
        scale={1.018}
      >
        <sphereGeometry args={[solarRadius, 96, 96]} />
        <meshBasicMaterial
          map={emissionTexture}
          color="#ffd46b"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.18}>
        <sphereGeometry args={[solarRadius, 96, 96]} />
        <shaderMaterial
          ref={coronaMaterialRef}
          uniforms={coronaUniforms}
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <sprite
        scale={[solarRadius * 5.4, solarRadius * 5.4, 1]}
        renderOrder={4}
      >
        <spriteMaterial
          map={glareTexture}
          color="#ffd66b"
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthTest
          depthWrite={false}
        />
      </sprite>

      <sprite
        scale={[solarRadius * 8.4, solarRadius * 0.72, 1]}
        renderOrder={5}
      >
        <spriteMaterial
          map={glareTexture}
          color="#ffb35c"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthTest
          depthWrite={false}
        />
      </sprite>

      <points ref={coronaDustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[coronaParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd46b"
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
