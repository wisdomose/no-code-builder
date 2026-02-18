import React, { useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "@/lib/useEditorStore";

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const { camera, setCamera, setSelectedId } = useEditorStore();
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
          Math.max(0.25, camera.scale * scaleChange),
        );

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Mathematically perfect cursor-centered zoom
          const newX = mouseX - (mouseX - camera.x) * (newScale / camera.scale);
          const newY = mouseY - (mouseY - camera.y) * (newScale / camera.scale);

          setCamera({
            scale: newScale,
            x: newX,
            y: newY,
          });
        }
      } else {
        // Normal scroll panned
        e.preventDefault();
        setCamera({
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        });
      }
    },
    [camera, setCamera],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Space+Click (Shift key proxy for Space+Click)
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

      setCamera({
        x: camera.x + e.movementX,
        y: camera.y + e.movementY,
      });
    },
    [camera, setCamera],
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedId = useEditorStore.getState().selectedId;
      if (!selectedId) return;

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
        case "z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              useEditorStore.getState().redo();
            } else {
              useEditorStore.getState().undo();
            }
          }
          break;
        case "y":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            useEditorStore.getState().redo();
          }
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
      className="w-full h-full bg-[#f0f0f0] relative overflow-hidden outline-none select-none"
      style={{
        backgroundImage: "radial-gradient(#d1d1d1 1px, transparent 0)",
        backgroundSize: `${20 * camera.scale}px ${20 * camera.scale}px`,
        backgroundPosition: `${camera.x}px ${camera.y}px`,
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: "0 0",
          transition: isPanning.current ? "none" : "transform 0.05s linear",
          backfaceVisibility: "hidden", // Helps with rendering quality
          transformStyle: "preserve-3d", // Keeps content in its own layer for crispness
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="pointer-events-auto">{children}</div>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md border border-border rounded shadow-md px-2 py-1 text-[10px] font-mono font-bold z-50 text-muted-foreground">
        {Math.round(camera.scale * 100)}%
      </div>
    </div>
  );
};
