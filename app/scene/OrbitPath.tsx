"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { calculateOrbitFrame } from "./orbitalMath";

type OrbitPathProps = {
  radius: number;
  inclination: number;
  ascendingNode: number;
  color: string;
};

export function OrbitPath({
  radius,
  inclination,
  ascendingNode,
  color,
}: OrbitPathProps) {
  const positions = useMemo(() => {
    const segmentCount = 240;
    const data = new Float32Array(segmentCount * 3);
    const position = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    for (let index = 0; index < segmentCount; index += 1) {
      calculateOrbitFrame(
        {
          radius,
          angle: (index / segmentCount) * Math.PI * 2,
          inclination,
          ascendingNode,
        },
        position,
        tangent,
      );
      data[index * 3] = position.x;
      data[index * 3 + 1] = position.y;
      data[index * 3 + 2] = position.z;
    }

    return data;
  }, [ascendingNode, inclination, radius]);

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.11}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </lineLoop>
  );
}
