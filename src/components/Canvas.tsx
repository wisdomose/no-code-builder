import React, { useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import { collectDescendants, cloneElement } from "@/lib/elementUtils";

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const setCamera = useEditorStore((s) => s.setCamera);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const camera = useEditorStore((s) => s.camera);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const touchState = useRef({ lastPinchDist: 0, lastPanX: 0, lastPanY: 0 });

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const cam = useEditorStore.getState().camera;

      if (e.ctrlKey || e.metaKey) {
        const scaleChange = -e.deltaY > 0 ? 1.1 : 0.9;
        const newScale = Math.min(4, Math.max(0.25, cam.scale * scaleChange));

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const ratio = newScale / cam.scale;
          setCamera({
            scale: newScale,
            x: mouseX - (mouseX - cam.x) * ratio,
            y: mouseY - (mouseY - cam.y) * ratio,
          });
        }
      } else {
        setCamera({ x: cam.x - e.deltaX, y: cam.y - e.deltaY });
      }
    },
    [setCamera],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true;
      document.body.style.cursor = "grabbing";
    } else if (e.target === containerRef.current) {
      setSelectedId(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isPanning.current = true;
    if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      touchState.current.lastPinchDist = Math.hypot(dx, dy);
      touchState.current.lastPanX =
        (e.touches[0].clientX + e.touches[1].clientX) / 2;
      touchState.current.lastPanY =
        (e.touches[0].clientY + e.touches[1].clientY) / 2;
    } else if (e.touches.length === 1) {
      if (
        e.target === containerRef.current ||
        (e.target as HTMLElement)?.getAttribute("data-artboard") === "true"
      ) {
        setSelectedId(null);
      }
      touchState.current.lastPinchDist = 0;
      touchState.current.lastPanX = e.touches[0].clientX;
      touchState.current.lastPanY = e.touches[0].clientY;
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning.current) return;
      const cam = useEditorStore.getState().camera;
      setCamera({ x: cam.x + e.movementX, y: cam.y + e.movementY });
    },
    [setCamera],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPanning.current) return;
      e.preventDefault(); // prevent native scroll taking over

      const cam = useEditorStore.getState().camera;

      if (e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.hypot(dx, dy);

        const panX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const panY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const panDx = panX - touchState.current.lastPanX;
        const panDy = panY - touchState.current.lastPanY;

        let scaleChange = 1;
        if (touchState.current.lastPinchDist > 0) {
          scaleChange = dist / touchState.current.lastPinchDist;
        }

        const newScale = Math.min(4, Math.max(0.25, cam.scale * scaleChange));

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = panX - rect.left;
          const mouseY = panY - rect.top;
          const ratio = newScale / cam.scale;

          setCamera({
            scale: newScale,
            x: mouseX - (mouseX - (cam.x + panDx)) * ratio,
            y: mouseY - (mouseY - (cam.y + panDy)) * ratio,
          });
        }

        touchState.current.lastPinchDist = dist;
        touchState.current.lastPanX = panX;
        touchState.current.lastPanY = panY;
      } else if (
        e.touches.length === 1 &&
        touchState.current.lastPinchDist === 0
      ) {
        const panX = e.touches[0].clientX;
        const panY = e.touches[0].clientY;
        const panDx = panX - touchState.current.lastPanX;
        const panDy = panY - touchState.current.lastPanY;

        setCamera({ x: cam.x + panDx, y: cam.y + panDy });

        touchState.current.lastPanX = panX;
        touchState.current.lastPanY = panY;
      }
    },
    [setCamera],
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    document.body.style.cursor = "default";
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      isPanning.current = false;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useEditorStore.getState();
      const { selectedId } = state;
      if (!selectedId) return;

      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active as HTMLElement)?.contentEditable === "true"
      )
        return;

      switch (e.key) {
        case "Delete":
        case "Backspace":
          state.removeElement(selectedId);
          break;

        case "Escape":
          setSelectedId(null);
          break;

        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight": {
          e.preventDefault();
          const el = state.elements[selectedId];
          if (!el) break;
          state.saveHistory();
          const step = e.shiftKey ? 10 : 1;
          const delta =
            e.key === "ArrowUp"
              ? { y: el.props.y - step }
              : e.key === "ArrowDown"
                ? { y: el.props.y + step }
                : e.key === "ArrowLeft"
                  ? { x: el.props.x - step }
                  : { x: el.props.x + step };
          state.updateElement(selectedId, delta);
          break;
        }

        case "d": {
          if (!(e.ctrlKey || e.metaKey)) break;
          e.preventDefault();
          const src = state.elements[selectedId];
          if (!src) break;

          const descendants = collectDescendants(selectedId, state.elements);
          const makeId = () =>
            `${src.type}-${Math.random().toString(36).slice(2, 11)}`;

          const idMap = new Map<string, string>([[selectedId, makeId()]]);
          for (const el of descendants) idMap.set(el.id, makeId());

          const newRootId = idMap.get(selectedId)!;
          const clones = [
            cloneElement(src, newRootId, src.parentId, 20, 20),
            ...descendants.map((el) =>
              cloneElement(
                el,
                idMap.get(el.id)!,
                idMap.get(el.parentId!)!,
                0,
                0,
              ),
            ),
          ];

          state.addElements(clones);
          state.setSelectedId(newRootId);
          break;
        }

        case "z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.shiftKey ? state.redo() : state.undo();
          }
          break;

        case "y":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            state.redo();
          }
          break;
      }
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleWheel,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
    setSelectedId,
  ]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  );
};
