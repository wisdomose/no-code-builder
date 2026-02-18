import React from "react";
import { useEditorStore } from "../lib/useEditorStore";
import { Element } from "./Element";

interface ArtboardProps {
  children?: React.ReactNode;
}

export const Artboard: React.FC<ArtboardProps> = ({ children }) => {
  const { artboard, elements } = useEditorStore();

  return (
    <div
      style={{
        width: `${artboard.width}px`,
        height: `${artboard.height}px`,
        backgroundColor: artboard.background,
        // Center the artboard within the transform layer initially
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
      className="absolute shadow-2xl relative overflow-visible"
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      {elements.map((element) => (
        <Element key={element.id} element={element} />
      ))}

      {children}
    </div>
  );
};
