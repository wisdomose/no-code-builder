import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { SnapLine } from "@/lib/useSnap";

/**
 * Renders active snap guide lines as absolutely-positioned overlays
 * inside the artboard coordinate space. Pointer-events are disabled
 * so they never interfere with element interaction.
 */
export const SnapOverlay: React.FC = () => {
  const snapLines = useEditorStore((s) => s.snapLines);
  const artboard = useEditorStore((s) => s.artboard);

  if (snapLines.length === 0) return null;

  return (
    <>
      {snapLines.map((line, i) => (
        <SnapGuide
          key={i}
          line={line}
          artboardW={artboard.width}
          artboardH={artboard.height}
        />
      ))}
    </>
  );
};

const SnapGuide: React.FC<{
  line: SnapLine;
  artboardW: number;
  artboardH: number;
}> = ({ line, artboardW, artboardH }) => {
  if (line.axis === "x") {
    // Vertical guide line at x = line.position
    const top = Math.min(line.from, 0);
    const height = Math.max(line.to, artboardH) - top;
    return (
      <div
        className="absolute pointer-events-none z-[999]"
        style={{
          left: `${line.position}px`,
          top: `${top}px`,
          width: "1px",
          height: `${height}px`,
          background: "rgba(239, 68, 68, 0.85)", // red-500
          boxShadow: "0 0 0 0.5px rgba(239,68,68,0.3)",
        }}
      />
    );
  }

  // Horizontal guide line at y = line.position
  const left = Math.min(line.from, 0);
  const width = Math.max(line.to, artboardW) - left;
  return (
    <div
      className="absolute pointer-events-none z-[999]"
      style={{
        top: `${line.position}px`,
        left: `${left}px`,
        height: "1px",
        width: `${width}px`,
        background: "rgba(239, 68, 68, 0.85)",
        boxShadow: "0 0 0 0.5px rgba(239,68,68,0.3)",
      }}
    />
  );
};
