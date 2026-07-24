"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitPath } from "./OrbitPath";
import { OrbitalDebris } from "./OrbitalDebris";
import { calculateOrbitFrame } from "./orbitalMath";
import { Planet } from "./Planet";
import type { SolarPlanetDefinition } from "./solarSystemConfig";
import type { OrbitalTarget } from "./sceneTypes";

type OrbitalPlanetProps = {
  definition: SolarPlanetDefinition;
  reducedMotion: boolean;
  target: OrbitalTarget;
};

export function OrbitalPlanet({
  definition,
  reducedMotion,
  target,
}: OrbitalPlanetProps) {
  const orbitalBodyRef = useRef<THREE.Group>(null);
  const framePosition = useMemo(() => new THREE.Vector3(), []);
  const frameTangent = useMemo(() => new THREE.Vector3(), []);
  const initialPosition = useMemo(() => {
    calculateOrbitFrame(
      {
        radius: definition.orbitRadius,
        angle: definition.orbitPhase,
        inclination: definition.inclination,
        ascendingNode: definition.ascendingNode,
      },
      framePosition,
      frameTangent,
    );
    target.position.copy(framePosition);
    target.tangent.copy(frameTangent);
    return framePosition.clone();
  }, [definition, framePosition, frameTangent, target]);

  useFrame((state) => {
    const elapsedTime = reducedMotion ? 0 : state.clock.elapsedTime;
    const angle =
      definition.orbitPhase + elapsedTime * definition.orbitSpeed;
    calculateOrbitFrame(
      {
        radius: definition.orbitRadius,
        angle,
        inclination: definition.inclination,
        ascendingNode: definition.ascendingNode,
      },
      framePosition,
      frameTangent,
    );

    orbitalBodyRef.current?.position.copy(framePosition);
    target.position.copy(framePosition);
    target.tangent.copy(frameTangent);
  });

  return (
    <>
      <OrbitPath
        radius={definition.orbitRadius}
        inclination={definition.inclination}
        ascendingNode={definition.ascendingNode}
        color={definition.palette.atmosphere}
      />
      <group ref={orbitalBodyRef} position={initialPosition}>
        <Planet
          position={[0, 0, 0]}
          radius={definition.radius}
          seed={definition.seed}
          palette={definition.palette}
          albedoMap={definition.albedoMap}
          heightMap={definition.heightMap}
          rotationSpeed={definition.rotationSpeed}
          ring={definition.ring}
          moon={definition.moon}
        />
        {definition.debris ? (
          <OrbitalDebris
            position={[0, 0, 0]}
            radius={definition.debris.radius}
            color={definition.debris.color}
          />
        ) : null}
      </group>
    </>
  );
}
