import * as THREE from "three";

export type OrbitFrameOptions = {
  radius: number;
  angle: number;
  inclination: number;
  ascendingNode: number;
};

export function calculateOrbitFrame(
  { radius, angle, inclination, ascendingNode }: OrbitFrameOptions,
  position: THREE.Vector3,
  tangent: THREE.Vector3,
) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const inclinationCosine = Math.cos(inclination);
  const inclinationSine = Math.sin(inclination);
  const nodeCosine = Math.cos(ascendingNode);
  const nodeSine = Math.sin(ascendingNode);

  const planeX = cosine * radius;
  const planeY = sine * radius * inclinationSine;
  const planeZ = sine * radius * inclinationCosine;
  position.set(
    planeX * nodeCosine + planeZ * nodeSine,
    planeY,
    -planeX * nodeSine + planeZ * nodeCosine,
  );

  const tangentX = -sine;
  const tangentY = cosine * inclinationSine;
  const tangentZ = cosine * inclinationCosine;
  tangent
    .set(
      tangentX * nodeCosine + tangentZ * nodeSine,
      tangentY,
      -tangentX * nodeSine + tangentZ * nodeCosine,
    )
    .normalize();
}
