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

  const startResize = (clientX: number) => {
    isResizing.current = true;
    lastX.current = clientX;
    document.body.style.cursor = "col-resize";

    const handleMove = (clientX: number) => {
      if (!isResizing.current) return;
      const delta = clientX - lastX.current;
      lastX.current = clientX;
      // For left sidebar: moving right (positive delta) increases width.
      // For right sidebar: moving right (positive delta) decreases width.
      // So if position is right, delta is positive. If left, it's negative.
      onResize(position === "right" ? delta : -delta);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      isResizing.current = false;
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startResize(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Cannot usually preventDefault passive touch events without a ref, but start is not passive here.
    startResize(e.touches[0].clientX);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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
