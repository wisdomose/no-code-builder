import React, { useEffect, useRef } from "react";

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      const delta = e.clientX - lastX.current;
      lastX.current = e.clientX;
      onResize(position === "left" ? delta : -delta);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      isResizing.current = true;
      lastX.current = e.clientX;
      document.body.style.cursor = "col-resize";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onResize, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = moveEvent.clientX - lastX.current;
      lastX.current = moveEvent.clientX;
      onResize(position === "left" ? delta : -delta);
    });
    window.addEventListener(
      "mouseup",
      () => {
        isResizing.current = false;
        document.body.style.cursor = "default";
      },
      { once: true },
    );
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`
        w-1.5 h-full cursor-col-resize hover:bg-primary/30 transition-colors
        fixed top-0 bottom-0 z-50
      `}
      style={{
        [position]: "-3px", // Center the handle over the border
      }}
    />
  );
};
