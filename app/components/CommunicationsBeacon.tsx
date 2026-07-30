"use client";

import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  calculateBeaconAim,
  nudgeBeaconAim,
  type BeaconAim,
  type BeaconAimDirection,
} from "./planetaryInteractionMath";
import { useTimedInteraction } from "./useTimedInteraction";

type CommunicationsBeaconProps = {
  reducedMotion: boolean;
};

type BeaconTargetStyle = CSSProperties & {
  "--aim-x": string;
  "--aim-y": string;
};

const keyDirections: Readonly<Record<string, BeaconAimDirection>> = {
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
  ArrowLeft: "left",
};

/**
 * Provides pointer and keyboard aiming before an optional contact-beacon launch.
 * The ordinary email link remains available directly below the interaction.
 */
export function CommunicationsBeacon({
  reducedMotion,
}: CommunicationsBeaconProps) {
  const [aim, setAim] = useState<BeaconAim>({ x: 50, y: 50 });
  const { reset, start, status } = useTimedInteraction({
    duration: 1_400,
    reducedMotion,
  });

  const updateAimFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    reset();
    setAim(calculateBeaconAim(event.clientX, event.clientY, bounds));
  };

  const updateAimFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = keyDirections[event.key];
    if (!direction) return;

    event.preventDefault();
    reset();
    setAim((current) => nudgeBeaconAim(current, direction));
  };

  const statusMessage =
    status === "running"
      ? "Beacon crossing the Nox relay"
      : status === "complete"
        ? "Signal lock confirmed"
        : "Select coordinates and launch";

  return (
    <section
      className={`planetary-interaction communications-beacon is-${status}`}
      aria-labelledby="communications-beacon-title"
    >
      <button
        aria-label="Aim the communications beacon. Click or tap a coordinate, or use the arrow keys."
        className="communications-beacon__target"
        onKeyDown={updateAimFromKeyboard}
        onPointerDown={updateAimFromPointer}
        style={
          {
            "--aim-x": `${aim.x}%`,
            "--aim-y": `${aim.y}%`,
          } as BeaconTargetStyle
        }
        type="button"
      >
        <span className="communications-beacon__orbit communications-beacon__orbit--outer" />
        <span className="communications-beacon__orbit communications-beacon__orbit--inner" />
        <span className="communications-beacon__crosshair" aria-hidden="true" />
        <span className="communications-beacon__pulse" aria-hidden="true" />
      </button>

      <div className="communications-beacon__console">
        <header className="planetary-interaction__header">
          <div>
            <span>Nox relay control</span>
            <h3 id="communications-beacon-title">
              Communications beacon
            </h3>
          </div>
        </header>
        <div className="communications-beacon__coordinates">
          <span>X {Math.round(aim.x).toString().padStart(3, "0")}</span>
          <span>Y {Math.round(aim.y).toString().padStart(3, "0")}</span>
        </div>
        <p aria-live="polite">{statusMessage}</p>
        <button
          className="planetary-interaction__action"
          disabled={status === "running"}
          onClick={start}
          type="button"
        >
          {status === "running"
            ? "Launching…"
            : status === "complete"
              ? "Relaunch beacon"
              : "Launch beacon"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
