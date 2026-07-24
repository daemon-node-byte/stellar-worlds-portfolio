import type {
  MoonSurface,
  PlanetId,
  PlanetPalette,
} from "./sceneTypes";

export type SolarPlanetDefinition = {
  id: PlanetId;
  radius: number;
  seed: number;
  palette: PlanetPalette;
  albedoMap: string;
  heightMap: string;
  rotationSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  inclination: number;
  ascendingNode: number;
  ring?: boolean;
  moon?: MoonSurface;
  debris?: {
    radius: number;
    color: string;
  };
};

export const solarRadius = 4.6;

export const planetDefinitions: readonly SolarPlanetDefinition[] = [
  {
    id: "signal",
    radius: 2.2,
    seed: 1.4,
    palette: {
      low: "#07100d",
      mid: "#31462a",
      high: "#9dad55",
      accent: "#d8ff45",
      atmosphere: "#a9b98a",
    },
    albedoMap: "/textures/planets/signal-albedo.jpg",
    heightMap: "/textures/planets/signal-height.jpg",
    rotationSpeed: 0.026,
    orbitRadius: 12.5,
    orbitSpeed: 0.085,
    orbitPhase: 0.28,
    inclination: 0.055,
    ascendingNode: 0.18,
    moon: {
      albedoMap: "/textures/planets/signal-moon-albedo.jpg",
      heightMap: "/textures/planets/signal-moon-height.jpg",
    },
  },
  {
    id: "virelia",
    radius: 2,
    seed: 2.8,
    palette: {
      low: "#07141a",
      mid: "#174b49",
      high: "#73a995",
      accent: "#ffb35c",
      atmosphere: "#88bfb3",
    },
    albedoMap: "/textures/planets/virelia-albedo.jpg",
    heightMap: "/textures/planets/virelia-height.jpg",
    rotationSpeed: 0.021,
    orbitRadius: 19,
    orbitSpeed: 0.058,
    orbitPhase: 1.62,
    inclination: -0.085,
    ascendingNode: -0.32,
    ring: true,
  },
  {
    id: "khepri",
    radius: 2.7,
    seed: 5.2,
    palette: {
      low: "#120b08",
      mid: "#4d2519",
      high: "#bd7650",
      accent: "#ffb35c",
      atmosphere: "#c58964",
    },
    albedoMap: "/textures/planets/khepri-albedo.jpg",
    heightMap: "/textures/planets/khepri-height.jpg",
    rotationSpeed: 0.017,
    orbitRadius: 26,
    orbitSpeed: 0.042,
    orbitPhase: 3.05,
    inclination: 0.115,
    ascendingNode: 0.52,
    moon: {
      albedoMap: "/textures/planets/khepri-moon-albedo.jpg",
      heightMap: "/textures/planets/khepri-moon-height.jpg",
    },
    debris: {
      radius: 4.3,
      color: "#96735c",
    },
  },
  {
    id: "calyx",
    radius: 1.85,
    seed: 8.6,
    palette: {
      low: "#090b16",
      mid: "#262c52",
      high: "#7988b3",
      accent: "#d8ff45",
      atmosphere: "#8895ad",
    },
    albedoMap: "/textures/planets/calyx-albedo.jpg",
    heightMap: "/textures/planets/calyx-height.jpg",
    rotationSpeed: 0.034,
    orbitRadius: 34.5,
    orbitSpeed: 0.031,
    orbitPhase: 4.42,
    inclination: -0.135,
    ascendingNode: 0.94,
    ring: true,
  },
  {
    id: "nox",
    radius: 2.4,
    seed: 13.1,
    palette: {
      low: "#070707",
      mid: "#26231e",
      high: "#777161",
      accent: "#d8ff45",
      atmosphere: "#b5b6a7",
    },
    albedoMap: "/textures/planets/nox-albedo.jpg",
    heightMap: "/textures/planets/nox-height.jpg",
    rotationSpeed: 0.015,
    orbitRadius: 44,
    orbitSpeed: 0.022,
    orbitPhase: 5.68,
    inclination: 0.075,
    ascendingNode: -0.76,
  },
] as const;
