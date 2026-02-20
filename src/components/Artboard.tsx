import React, { useRef } from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import { Element as EditorElementComponent } from "./Element";
import { SnapOverlay } from "./SnapOverlay";
import { EditorOverlay } from "./EditorOverlay";

export const Artboard: React.FC = () => {
  const artboard = useEditorStore((s) => s.artboard);
  const setArtboard = useEditorStore((s) => s.setArtboard);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const elements = useEditorStore((s) => s.elements);
  const artboardRef = useRef<HTMLDivElement>(null);

  const rootElements = React.useMemo(
    () =>
      Object.values(elements)
        .filter((el) => !el.parentId)
        .sort((a, b) => (a.index || 0) - (b.index || 0)),
    [elements],
  );

  // ── Vertical resize handle ─────────────────────────────────────────────────
  const startHeightDrag = (clientY: number) => {
    const startY = clientY;
    const startHeight = artboard.height;
    const camera = useEditorStore.getState().camera;

    const handleMove = (clientY: number) => {
      const dy = (clientY - startY) / camera.scale;
      const newHeight = Math.max(200, Math.round(startHeight + dy));
      setArtboard({ height: newHeight });
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      document.body.style.cursor = "";
    };

    document.body.style.cursor = "ns-resize";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onMouseUp);
  };

  const handleHeightDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startHeightDrag(e.clientY);
  };

  const handleHeightTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    startHeightDrag(e.touches[0].clientY);
  };

  // ── Click on artboard background deselects ─────────────────────────────────
  const handleArtboardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only deselect when clicking directly on the artboard, not on a child element
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const handleArtboardTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div className="absolute" style={{ left: 0, top: 0 }}>
      {/* Artboard surface */}
      <div
        data-artboard="true"
        ref={artboardRef}
        onMouseDown={handleArtboardMouseDown}
        onTouchStart={handleArtboardTouchStart}
        style={{
          width: `${artboard.width}px`,
          height: `${artboard.height}px`,
          backgroundColor: artboard.background,
          isolation: "isolate",
        }}
        className="relative shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_30px_rgba(0,0,0,0.1)] outline outline-1 outline-black/5"
      >
        {rootElements.map((el) => (
          <EditorElementComponent key={el.id} element={el} />
        ))}

        {/* Snap guide lines */}
        <SnapOverlay />

        {/* Editor chrome: selection rings, resize handles, hover highlights */}
        <EditorOverlay artboardRef={artboardRef} />
      </div>

      {/* ── Height resize handle ── */}
      <div
        onMouseDown={handleHeightDragStart}
        onTouchStart={handleHeightTouchStart}
        style={{ width: `${artboard.width}px` }}
        className="relative h-3 flex items-center justify-center cursor-ns-resize group mt-0"
        title="Drag to resize artboard height"
      >
        {/* Visual pill */}
        <div className="w-16 h-1 rounded-full bg-black/20 group-hover:bg-[#007aff]/60 transition-colors duration-150" />
      </div>

      {/* Height label */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[10px] text-black/30 select-none pointer-events-none"
        style={{ top: `${artboard.height + 12}px` }}
      >
        {artboard.width} × {artboard.height}
      </div>
    </div>
  );
};
