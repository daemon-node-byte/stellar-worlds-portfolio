"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(1100 * 3);
    for (let index = 0; index < 1100; index += 1) {
      data[index * 3] = (seededRandom(index) - 0.5) * 110;
      data[index * 3 + 1] = (seededRandom(index + 1400) - 0.5) * 150 - 25;
      data[index * 3 + 2] = -seededRandom(index + 2800) * 65 + 14;
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d8ff45"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.48}
        depthWrite={false}
      />
    </points>
  );
}
