import React, { useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement } from "@/lib/useEditorStore";

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const { setCamera, setSelectedId } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);

  // #13 fix: read camera from store directly to avoid stale closure
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const camera = useEditorStore.getState().camera;

      if (e.ctrlKey || e.metaKey) {
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

          const newX = mouseX - (mouseX - camera.x) * (newScale / camera.scale);
          const newY = mouseY - (mouseY - camera.y) * (newScale / camera.scale);

          setCamera({ scale: newScale, x: newX, y: newY });
        }
      } else {
        // #3 fix: functional update reads latest camera so panning stays smooth
        setCamera({
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        });
      }
    },
    [setCamera], // stable dep — no camera closure
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true;
      document.body.style.cursor = "grabbing";
    } else if (e.target === containerRef.current) {
      setSelectedId(null);
    }
  };

  // #3 fix: read camera from store to avoid stale closure during fast pan
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning.current) return;
      const camera = useEditorStore.getState().camera;
      setCamera({
        x: camera.x + e.movementX,
        y: camera.y + e.movementY,
      });
    },
    [setCamera],
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    document.body.style.cursor = "default";
  }, []);

  // Helper: recursively collect all descendants
  function collectDescendants(
    parentId: string,
    elements: Record<string, EditorElement>,
  ): EditorElement[] {
    const children = Object.values(elements).filter(
      (el) => el.parentId === parentId,
    );
    return children.flatMap((child) => [
      child,
      ...collectDescendants(child.id, elements),
    ]);
  }

  // Helper: deep-clone an element with a new ID, optionally reparenting
  function cloneElement(
    el: EditorElement,
    newId: string,
    newParentId: string | undefined,
    offsetX: number,
    offsetY: number,
  ): EditorElement {
    return {
      ...el,
      id: newId,
      parentId: newParentId,
      props: {
        ...el.props,
        x: el.props.x + offsetX,
        y: el.props.y + offsetY,
      },
    };
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useEditorStore.getState();
      const selectedId = state.selectedId;
      if (!selectedId) return;

      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

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
          // #1 fix: save history before nudge so each nudge is undoable
          state.saveHistory();
          const step = e.shiftKey ? 10 : 1;
          const updates =
            e.key === "ArrowUp"
              ? { y: el.props.y - step }
              : e.key === "ArrowDown"
                ? { y: el.props.y + step }
                : e.key === "ArrowLeft"
                  ? { x: el.props.x - step }
                  : { x: el.props.x + step };
          state.updateElement(selectedId, updates);
          break;
        }

        case "d": {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const src = state.elements[selectedId];
            if (!src) break;

            // #4 fix: recursively clone all descendants
            const descendants = collectDescendants(selectedId, state.elements);

            // Build an ID mapping: old ID → new ID
            const idMap = new Map<string, string>();
            const makeId = (el: EditorElement) =>
              `${el.type}-${Math.random().toString(36).substr(2, 9)}`;

            const newRootId = makeId(src);
            idMap.set(selectedId, newRootId);
            descendants.forEach((el) => idMap.set(el.id, makeId(el)));

            const clones: EditorElement[] = [
              cloneElement(src, newRootId, src.parentId, 20, 20),
              ...descendants.map((el) =>
                // descendants keep relative positions (no offset)
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
          }
          break;
        }

        case "z": {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              state.redo();
            } else {
              state.undo();
            }
          }
          break;
        }

        case "y": {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            state.redo();
          }
          break;
        }
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

  const camera = useEditorStore((s) => s.camera);

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
