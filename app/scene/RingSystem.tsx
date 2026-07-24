"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ringVertexShader = `
  varying vec2 vRingPosition;
  varying vec3 vViewDirection;
  varying vec3 vViewNormal;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vRingPosition = position.xy;
    vViewDirection = normalize(-viewPosition.xyz);
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const ringFragmentShader = `
  uniform vec3 baseColor;
  uniform vec3 dustColor;
  uniform float innerRadius;
  uniform float outerRadius;
  uniform float opacity;
  uniform float seed;

  varying vec2 vRingPosition;
  varying vec3 vViewDirection;
  varying vec3 vViewNormal;

  float hash(float value) {
    return fract(sin(value) * 43758.5453123);
  }

  float noise(float value) {
    float index = floor(value);
    float fraction = fract(value);
    float curve = fraction * fraction * (3.0 - 2.0 * fraction);
    return mix(hash(index), hash(index + 1.0), curve);
  }

  void main() {
    float radius = length(vRingPosition);
    float radial = clamp(
      (radius - innerRadius) / (outerRadius - innerRadius),
      0.0,
      1.0
    );

    float broadBands = 0.5 + 0.5 * sin(radial * 91.0 + seed * 2.7);
    float mediumBands = 0.5 + 0.5 * sin(radial * 287.0 - seed * 4.1);
    float fineBands = noise(radial * 640.0 + seed * 19.0);
    float clusteredDust = noise(radial * 173.0 - seed * 8.0);
    float density = smoothstep(
      0.30,
      0.78,
      broadBands * 0.27 +
      mediumBands * 0.24 +
      fineBands * 0.31 +
      clusteredDust * 0.18
    );

    float gapOne = smoothstep(
      0.008,
      0.022,
      abs(radial - (0.28 + sin(seed) * 0.025))
    );
    float gapTwo = smoothstep(
      0.006,
      0.017,
      abs(radial - (0.61 + cos(seed * 1.7) * 0.035))
    );
    float gapThree = smoothstep(
      0.004,
      0.013,
      abs(radial - (0.79 + sin(seed * 2.3) * 0.018))
    );
    float edgeFade =
      smoothstep(0.0, 0.065, radial) *
      (1.0 - smoothstep(0.88, 1.0, radial));

    float angle = atan(vRingPosition.y, vRingPosition.x);
    float azimuthVariation =
      0.82 + 0.18 * (0.5 + 0.5 * sin(angle * 3.0 + seed));
    float planetaryShadow = 0.58 + 0.42 * smoothstep(
      0.06,
      0.56,
      abs(sin((angle - 0.68) * 0.5))
    );
    float grazingLight = pow(
      1.0 - abs(dot(normalize(vViewNormal), normalize(vViewDirection))),
      1.4
    );

    float alpha =
      edgeFade *
      gapOne *
      gapTwo *
      gapThree *
      mix(0.13, 0.92, density) *
      azimuthVariation *
      opacity;

    if (alpha < 0.012) {
      discard;
    }

    float mineralMix = clamp(
      0.08 + radial * 0.22 + fineBands * 0.07,
      0.0,
      0.34
    );
    vec3 color = mix(baseColor, dustColor, mineralMix);
    color *= planetaryShadow * (0.82 + grazingLight * 0.18);

    gl_FragColor = vec4(color, alpha);
  }
`;

function seededRandom(index: number, seed: number) {
  const value = Math.sin(index * 91.713 + seed * 47.117) * 43758.5453;
  return value - Math.floor(value);
}

type RingSystemProps = {
  radius: number;
  seed: number;
  baseColor: string;
  dustColor: string;
};

export function RingSystem({
  radius,
  seed,
  baseColor,
  dustColor,
}: RingSystemProps) {
  const dustRef = useRef<THREE.Points>(null);
  const innerRadius = radius * 1.34;
  const outerRadius = radius * 2.08;
  const uniforms = useMemo(
    () => ({
      baseColor: { value: new THREE.Color(baseColor) },
      dustColor: { value: new THREE.Color(dustColor) },
      innerRadius: { value: innerRadius },
      outerRadius: { value: outerRadius },
      opacity: { value: 0.62 },
      seed: { value: seed },
    }),
    [baseColor, dustColor, innerRadius, outerRadius, seed],
  );
  const dustPositions = useMemo(() => {
    const particleCount = 520;
    const positions = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      const radialProgress = Math.pow(seededRandom(index, seed), 0.84);
      const particleRadius = THREE.MathUtils.lerp(
        innerRadius * 0.98,
        outerRadius * 1.045,
        radialProgress,
      );
      const angle = seededRandom(index + particleCount, seed) * Math.PI * 2;
      const verticalScatter =
        (seededRandom(index + particleCount * 2, seed) - 0.5) *
        radius *
        0.035;

      positions[index * 3] = Math.cos(angle) * particleRadius;
      positions[index * 3 + 1] = Math.sin(angle) * particleRadius;
      positions[index * 3 + 2] = verticalScatter;
    }

    return positions;
  }, [innerRadius, outerRadius, radius, seed]);

  useFrame((_, delta) => {
    if (dustRef.current) {
      dustRef.current.rotation.z += delta * 0.006;
    }
  });

  return (
    <group rotation={[Math.PI * 0.38 + seed * 0.008, 0.25, 0.06]}>
      <mesh>
        <ringGeometry args={[innerRadius, outerRadius, 256, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={ringVertexShader}
          fragmentShader={ringFragmentShader}
          side={THREE.DoubleSide}
          transparent
          forceSinglePass
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={baseColor}
          size={radius * 0.008}
          sizeAttenuation
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}
