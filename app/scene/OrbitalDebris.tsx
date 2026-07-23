"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbitalDebrisProps = {
  position: [number, number, number];
  radius: number;
  color: string;
};

export function OrbitalDebris({
  position,
  radius,
  color,
}: OrbitalDebrisProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const transforms = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => {
        const angle = (index / 72) * Math.PI * 2;
        const variance = Math.sin(index * 42.73) * 0.45;
        return {
          position: new THREE.Vector3(
            Math.cos(angle) * (radius + variance),
            Math.sin(index * 1.71) * 0.34,
            Math.sin(angle) * (radius + variance),
          ),
          rotation: new THREE.Euler(
            index * 0.31,
            index * 0.71,
            index * 0.13,
          ),
          scale: 0.035 + ((index * 17) % 9) * 0.009,
        };
      }),
    [radius],
  );

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    transforms.forEach((transform, index) => {
      dummy.position.copy(transform.position);
      dummy.rotation.copy(transform.rotation);
      dummy.scale.setScalar(transform.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [transforms]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.018;
    }
  });

  return (
    <group position={position} rotation={[0.3, 0.15, 0.55]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, transforms.length]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}
