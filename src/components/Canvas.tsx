import React, { useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "../lib/useEditorStore";

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const { canvas, setCanvas, setSelectedId } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const scaleChange = delta > 0 ? 1.1 : 0.9;
        const newScale = Math.min(
          4,
          Math.max(0.25, canvas.scale * scaleChange),
        );

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Cursor-centered zoom math
          const newTranslateX =
            mouseX - (mouseX - canvas.translateX) * (newScale / canvas.scale);
          const newTranslateY =
            mouseY - (mouseY - canvas.translateY) * (newScale / canvas.scale);

          setCanvas({
            scale: newScale,
            translateX: newTranslateX,
            translateY: newTranslateY,
          });
        }
      } else {
        // Normal scroll panned
        setCanvas({
          translateX: canvas.translateX - e.deltaX,
          translateY: canvas.translateY - e.deltaY,
        });
      }
    },
    [canvas, setCanvas],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true;
      document.body.style.cursor = "grabbing";
    } else if (e.target === containerRef.current) {
      setSelectedId(null);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning.current) return;

      setCanvas({
        translateX: canvas.translateX + e.movementX,
        translateY: canvas.translateY + e.movementY,
      });
    },
    [canvas, setCanvas],
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedId = useEditorStore.getState().selectedId;
      if (!selectedId) return;

      // Don't trigger if user is typing in an input
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "Delete":
        case "Backspace":
          useEditorStore.getState().removeElement(selectedId);
          break;
        case "Escape":
          setSelectedId(null);
          break;
        case "ArrowUp":
          e.preventDefault();
          useEditorStore.getState().updateElement(selectedId, {
            y:
              useEditorStore
                .getState()
                .elements.find((el) => el.id === selectedId)!.props.y - 1,
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          useEditorStore.getState().updateElement(selectedId, {
            y:
              useEditorStore
                .getState()
                .elements.find((el) => el.id === selectedId)!.props.y + 1,
          });
          break;
        case "ArrowLeft":
          e.preventDefault();
          useEditorStore.getState().updateElement(selectedId, {
            x:
              useEditorStore
                .getState()
                .elements.find((el) => el.id === selectedId)!.props.x - 1,
          });
          break;
        case "ArrowRight":
          e.preventDefault();
          useEditorStore.getState().updateElement(selectedId, {
            x:
              useEditorStore
                .getState()
                .elements.find((el) => el.id === selectedId)!.props.x + 1,
          });
          break;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp, setSelectedId]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="w-full h-full bg-muted/30 relative overflow-hidden outline-none select-none"
    >
      <div
        style={{
          transform: `translate(${canvas.translateX}px, ${canvas.translateY}px) scale(${canvas.scale})`,
          transformOrigin: "0 0",
          transition: isPanning.current ? "none" : "transform 0.1s ease-out",
          willChange: "transform",
        }}
        className="absolute inset-0"
      >
        {children}
      </div>

      {/* Zoom Indicator */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur border rounded px-2 py-1 text-xs font-medium shadow-sm z-50">
        {Math.round(canvas.scale * 100)}%
      </div>
    </div>
  );
};
