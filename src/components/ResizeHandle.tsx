import React, { useRef } from "react";

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  position: "left" | "right";
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  position,
}) => {
  const isResizing = useRef(false);
  const lastX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = "col-resize";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = moveEvent.clientX - lastX.current;
      lastX.current = moveEvent.clientX;
      // For left sidebar: moving right (positive delta) increases width.
      // For right sidebar: moving right (positive delta) decreases width.
      // So if position is right, delta is positive. If left, it's negative.
      onResize(position === "right" ? delta : -delta);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`
        w-1.5 h-full cursor-col-resize hover:bg-[#007aff]/30 transition-colors
        absolute top-0 bottom-0 z-50
      `}
      style={{
        [position === "right" ? "right" : "left"]: "-3px",
      }}
    />
  );
};
