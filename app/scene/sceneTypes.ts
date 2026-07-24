import type { Vector3 } from "three";

export type ScrollProgressRef = {
  current: number;
};

export type PlanetPalette = {
  low: string;
  mid: string;
  high: string;
  accent: string;
  atmosphere: string;
};

export type MoonSurface = {
  albedoMap: string;
  heightMap: string;
};

export type PlanetId = "signal" | "virelia" | "khepri" | "calyx" | "nox";

export type OrbitalTarget = {
  position: Vector3;
  tangent: Vector3;
  radius: number;
};

export type OrbitalTargetRegistry = Record<PlanetId, OrbitalTarget>;
