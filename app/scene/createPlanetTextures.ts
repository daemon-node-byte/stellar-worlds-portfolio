import * as THREE from "three";
import type { PlanetPalette } from "./sceneTypes";

const TEXTURE_WIDTH = 384;
const TEXTURE_HEIGHT = 192;

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function mixChannel(start: number, end: number, amount: number) {
  return Math.round(THREE.MathUtils.lerp(start, end, amount));
}

function sampleTerrain(u: number, v: number, seed: number) {
  const longitude = u * Math.PI * 2;
  const latitude = (v - 0.5) * Math.PI;
  const x = Math.cos(latitude) * Math.cos(longitude);
  const y = Math.sin(latitude);
  const z = Math.cos(latitude) * Math.sin(longitude);

  const continental =
    Math.sin((x * 2.7 + y * 1.9 + z * 2.2 + seed) * 2.1) * 0.24 +
    Math.sin((x * 5.8 - y * 4.1 + z * 3.3 + seed * 1.7) * 1.8) * 0.14;
  const detail =
    Math.sin((x * 13.2 + y * 8.3 - z * 11.7 + seed * 3.1) * 1.35) *
    0.075;
  const ridges =
    (1 -
      Math.abs(
        Math.sin((x * 7.4 - y * 9.1 + z * 6.6 + seed * 2.3) * 1.5),
      )) *
    0.18;
  const polar = Math.pow(Math.abs(y), 5) * 0.12;

  return THREE.MathUtils.clamp(
    0.43 + continental + detail + ridges + polar,
    0,
    1,
  );
}

export function createPlanetTextures(seed: number, palette: PlanetPalette) {
  const colorData = new Uint8Array(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4);
  const heightData = new Uint8Array(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4);
  const colors = {
    low: hexToRgb(palette.low),
    mid: hexToRgb(palette.mid),
    high: hexToRgb(palette.high),
    accent: hexToRgb(palette.accent),
  };

  for (let y = 0; y < TEXTURE_HEIGHT; y += 1) {
    for (let x = 0; x < TEXTURE_WIDTH; x += 1) {
      const u = x / (TEXTURE_WIDTH - 1);
      const v = y / (TEXTURE_HEIGHT - 1);
      const height = sampleTerrain(u, v, seed);
      const index = (y * TEXTURE_WIDTH + x) * 4;
      const lowerHalf = height < 0.54;
      const start = lowerHalf ? colors.low : colors.mid;
      const end = lowerHalf ? colors.mid : colors.high;
      const blend = lowerHalf
        ? THREE.MathUtils.smoothstep(height, 0.12, 0.54)
        : THREE.MathUtils.smoothstep(height, 0.54, 0.9);
      const ridgeSignal = Math.sin((u * 34 + v * 19 + seed) * Math.PI);
      const isBioluminescentRidge = height > 0.71 && ridgeSignal > 0.82;
      const target = isBioluminescentRidge ? colors.accent : end;
      const grain = Math.sin((x * 12.9898 + y * 78.233 + seed) * 0.01) * 4;
      const grayscale = Math.round(height * 255);

      colorData[index] = THREE.MathUtils.clamp(
        mixChannel(start.r, target.r, blend) + grain,
        0,
        255,
      );
      colorData[index + 1] = THREE.MathUtils.clamp(
        mixChannel(start.g, target.g, blend) + grain,
        0,
        255,
      );
      colorData[index + 2] = THREE.MathUtils.clamp(
        mixChannel(start.b, target.b, blend) + grain,
        0,
        255,
      );
      colorData[index + 3] = 255;

      heightData[index] = grayscale;
      heightData[index + 1] = grayscale;
      heightData[index + 2] = grayscale;
      heightData[index + 3] = 255;
    }
  }

  const colorMap = new THREE.DataTexture(
    colorData,
    TEXTURE_WIDTH,
    TEXTURE_HEIGHT,
    THREE.RGBAFormat,
  );
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  colorMap.magFilter = THREE.LinearFilter;
  colorMap.needsUpdate = true;

  const heightMap = new THREE.DataTexture(
    heightData,
    TEXTURE_WIDTH,
    TEXTURE_HEIGHT,
    THREE.RGBAFormat,
  );
  heightMap.colorSpace = THREE.NoColorSpace;
  heightMap.wrapS = THREE.RepeatWrapping;
  heightMap.minFilter = THREE.LinearMipmapLinearFilter;
  heightMap.magFilter = THREE.LinearFilter;
  heightMap.needsUpdate = true;

  return { colorMap, heightMap };
}
