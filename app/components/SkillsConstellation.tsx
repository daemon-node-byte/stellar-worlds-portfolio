"use client";

import { useState, type CSSProperties } from "react";
import {
  defaultSkillConstellationNodeId,
  skillConstellationNodes,
  type SkillConstellationNodeId,
} from "../data/skillConstellation";
import {
  calculateConstellationConnection,
  skillConstellationCenter,
} from "./skillConstellationMath";

type ConstellationNodeStyle = CSSProperties & {
  "--node-delay": string;
};

/**
 * Renders the About view's locally interactive, keyboard-accessible skills map.
 * It reads static portfolio data and owns only the currently selected signal.
 * Usage: mount once beside the About profile content.
 */
export function SkillsConstellation() {
  const [activeNodeId, setActiveNodeId] =
    useState<SkillConstellationNodeId>(defaultSkillConstellationNodeId);
  const activeNode =
    skillConstellationNodes.find((node) => node.id === activeNodeId) ??
    skillConstellationNodes[0];

  const selectNode = (nodeId: SkillConstellationNodeId) => {
    setActiveNodeId(nodeId);
  };

  return (
    <section
      className="skills-constellation"
      aria-labelledby="skills-constellation-title"
    >
      <header className="skills-constellation__header">
        <div>
          <span>Live telemetry</span>
          <h3 id="skills-constellation-title">Skills constellation</h3>
        </div>
        <p>Select a signal</p>
      </header>

      <div
        className="skills-constellation__map"
        role="group"
        aria-label="Interactive technology skill map"
      >
        <span className="skills-constellation__orbit skills-constellation__orbit--outer" />
        <span className="skills-constellation__orbit skills-constellation__orbit--inner" />

        {skillConstellationNodes.map((node) => {
          const connection = calculateConstellationConnection(node.position);

          return (
            <span
              aria-hidden="true"
              className={`skills-constellation__connection ${
                activeNodeId === node.id ? "is-active" : ""
              }`}
              key={`${node.id}-connection`}
              style={{
                left: `${skillConstellationCenter.x}%`,
                top: `${skillConstellationCenter.y}%`,
                width: `${connection.length}%`,
                transform: `rotate(${connection.angle}deg)`,
              }}
            />
          );
        })}

        <div
          aria-hidden="true"
          className="skills-constellation__core"
          style={{
            left: `${skillConstellationCenter.x}%`,
            top: `${skillConstellationCenter.y}%`,
          }}
        >
          <span />
          <small>Full stack</small>
        </div>

        {skillConstellationNodes.map((node, index) => (
          <button
            aria-controls="skills-constellation-detail"
            aria-pressed={activeNodeId === node.id}
            className={`skills-constellation__node ${
              activeNodeId === node.id ? "is-active" : ""
            }`}
            key={node.id}
            onClick={() => selectNode(node.id)}
            onFocus={() => selectNode(node.id)}
            onPointerEnter={() => selectNode(node.id)}
            style={
              {
                "--node-delay": `${index * -0.27}s`,
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
              } as ConstellationNodeStyle
            }
            type="button"
          >
            <span className="skills-constellation__star" aria-hidden="true" />
            <span className="skills-constellation__node-label">
              {node.label}
            </span>
          </button>
        ))}
      </div>

      <div
        className="skills-constellation__detail"
        id="skills-constellation-detail"
        aria-live="polite"
      >
        <div className="skills-constellation__detail-meta">
          <span>{activeNode.category}</span>
          <span>
            Signal{" "}
            {String(
              skillConstellationNodes.findIndex(
                (node) => node.id === activeNode.id,
              ) + 1,
            ).padStart(2, "0")}
            /{String(skillConstellationNodes.length).padStart(2, "0")}
          </span>
        </div>
        <h3>{activeNode.label}</h3>
        <p>{activeNode.summary}</p>
        <ul aria-label={`${activeNode.label} related skills`}>
          {activeNode.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
