import React from "react";
import { useEditorStore, DEVICE_WIDTHS } from "@/lib/useEditorStore";
import type { EditorElement, ElementLayout } from "@/lib/useEditorStore";
import { getSnapResult, computeArtboardHeight } from "@/lib/useSnap";
import { Z } from "@/lib/layers";

interface EditorOverlayProps {
  /** Ref to the artboard surface div — used only as a fallback for flow children. */
  artboardRef: React.RefObject<HTMLDivElement | null>;
}

// ─── Rect type ────────────────────────────────────────────────────────────────

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DistanceGuideData {
  orientation: "horizontal" | "vertical";
  value: number;
  lineStart: { x: number; y: number };
  lineEnd: { x: number; y: number };
  labelPos: { x: number; y: number };
}

// ─── Position helpers ─────────────────────────────────────────────────────────

/**
 * Returns the element's artboard-space rect purely from the store.
 * Returns null if the element (or any ancestor) is a flex/grid child,
 * because those positions are browser-computed and can't be read from data.
 */
function computeRectFromStore(
  element: EditorElement,
  elements: Record<string, EditorElement>,
): Rect | null {
  // Trust store coordinates ONLY for absolute elements.
  // Flow elements (flex/grid/standard block) must be measured via DOM
  // because their visual position depends on siblings and parent layout.
  if (element.layout.position !== "absolute") return null;

  // Additional safety: if any parent is a flow container, bail out.
  let cur = element;
  while (cur.parentId) {
    const parent = elements[cur.parentId];
    if (!parent) break;
    if (parent.layout.display === "flex" || parent.layout.display === "grid") {
      return null;
    }
    cur = parent;
  }

  const w =
    typeof element.layout.width === "number" ? element.layout.width : null;
  const h =
    typeof element.layout.height === "number" ? element.layout.height : null;
  if (w === null || h === null) return null;

  // Sum all ancestor absolute positions
  let x = element.layout.x ?? 0;
  let y = element.layout.y ?? 0;
  cur = element;
  while (cur.parentId) {
    const parent = elements[cur.parentId];
    if (!parent) break;
    x += parent.layout.x ?? 0;
    y += parent.layout.y ?? 0;
    cur = parent;
  }

  return { x, y, w, h };
}

/**
 * Fallback: DOM measurement for flex/grid children whose visual
 * position is not stored. Divides by actual current scale to convert
 * from screen pixels to artboard pixels, immune to mid-transition states.
 */
function measureFromDOM(
  elementId: string,
  artboardEl: HTMLDivElement,
): Rect | null {
  const node = artboardEl.querySelector(
    `[data-element-id="${elementId}"]`,
  ) as HTMLElement | null;
  if (!node) return null;

  const aRect = artboardEl.getBoundingClientRect();
  const eRect = node.getBoundingClientRect();

  // Compute the actual visual scale currently applied to the DOM.
  // This correctly maps screen pixels to artboard space even during CSS scale animations.
  const actualScale =
    artboardEl.offsetWidth > 0 ? aRect.width / artboardEl.offsetWidth : 1;

  return {
    x: (eRect.left - aRect.left) / actualScale,
    y: (eRect.top - aRect.top) / actualScale,
    w: eRect.width / actualScale,
    h: eRect.height / actualScale,
  };
}

// ─── Resize logic (with snap) ─────────────────────────────────────────────────

function useResizeHandles(element: EditorElement | null, rect: Rect | null) {
  const startResize = (clientX: number, clientY: number, dir: string) => {
    if (!element || !rect) return;

    const store = useEditorStore.getState();
    store.saveHistory();

    const startX = clientX;
    const startY = clientY;
    const startW = rect.w;
    const startH = rect.h;
    const startEX = element.layout.x ?? 0;
    const startEY = element.layout.y ?? 0;

    const handleMove = (clientX: number, clientY: number) => {
      const state = useEditorStore.getState();
      const currentCamera = state.camera;
      let dx = (clientX - startX) / currentCamera.scale;
      let dy = (clientY - startY) / currentCamera.scale;

      // ── Snap during resize ─────────────────────────────────────────────────
      const { artboard, deviceMode, elements: allEls } = state;
      const artboardH = computeArtboardHeight(allEls, artboard.height);

      let propX = startEX;
      let propY = startEY;
      let propW = startW;
      let propH = startH;
      if (dir.includes("e")) propW = Math.max(10, startW + dx);
      if (dir.includes("s")) propH = Math.max(10, startH + dy);
      if (dir.includes("w")) {
        propW = Math.max(10, startW - dx);
        propX = startEX + (startW - propW);
      }
      if (dir.includes("n")) {
        propH = Math.max(10, startH - dy);
        propY = startEY + (startH - propH);
      }

      const peers = Object.values(allEls).filter(
        (el) => !el.parentId && el.id !== element.id,
      );
      const snap = getSnapResult(
        { x: propX, y: propY, w: propW, h: propH },
        DEVICE_WIDTHS[deviceMode],
        artboardH,
        peers,
      );
      if (dir.includes("e") || dir.includes("w")) dx += snap.dx;
      if (dir.includes("s") || dir.includes("n")) dy += snap.dy;
      state.setSnapLines(snap.lines);
      // ──────────────────────────────────────────────────────────────────────

      const updates: Partial<ElementLayout> = {};
      if (dir.includes("e"))
        updates.width = Math.max(10, Math.round(startW + dx));
      if (dir.includes("s"))
        updates.height = Math.max(10, Math.round(startH + dy));
      if (dir.includes("w")) {
        const newW = Math.max(10, Math.round(startW - dx));
        updates.width = newW;
        updates.x = startEX + (startW - newW);
      }
      if (dir.includes("n")) {
        const newH = Math.max(10, Math.round(startH - dy));
        updates.height = newH;
        updates.y = startEY + (startH - newH);
      }

      useEditorStore.getState().updateElement(element.id, updates);
    };

    const handleResize = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchResize = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", handleTouchResize);
      window.removeEventListener("touchend", stopResize);
      window.removeEventListener("touchcancel", stopResize);
      useEditorStore.getState().setSnapLines([]);
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", handleTouchResize, { passive: false });
    window.addEventListener("touchend", stopResize);
    window.addEventListener("touchcancel", stopResize);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    startResize(e.clientX, e.clientY, dir);
  };

  const handleResizeTouchStart = (e: React.TouchEvent, dir: string) => {
    e.stopPropagation();
    startResize(e.touches[0].clientX, e.touches[0].clientY, dir);
  };

  return { handleResizeMouseDown, handleResizeTouchStart };
}

// ─── Handle config ────────────────────────────────────────────────────────────

const HANDLE_DIRS = ["nw", "n", "ne", "w", "e", "sw", "s", "se"] as const;

const CURSOR_MAP: Record<string, string> = {
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  n: "ns-resize",
  s: "ns-resize",
  w: "ew-resize",
  e: "ew-resize",
};

// ─── Selection chrome ─────────────────────────────────────────────────────────

interface ChromeProps {
  rect: Rect;
  scale: number;
  element: EditorElement;
}

const SelectionChrome: React.FC<ChromeProps> = ({ rect, scale, element }) => {
  const { handleResizeMouseDown, handleResizeTouchStart } = useResizeHandles(
    element,
    rect,
  );

  return (
    <>
      {/* Selection outline */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          zIndex: Z.SELECT_RING,
          outline: "1px solid #007aff",
          outlineOffset: "-1px",
        }}
      />

      {/* All 8 resize handles — always visible when selected */}
      {HANDLE_DIRS.map((dir) => {
        const top = dir.includes("n")
          ? rect.y
          : dir.includes("s")
            ? rect.y + rect.h
            : rect.y + rect.h / 2;
        const left = dir.includes("w")
          ? rect.x
          : dir.includes("e")
            ? rect.x + rect.w
            : rect.x + rect.w / 2;

        return (
          <div
            key={dir}
            onMouseDown={(e) => handleResizeMouseDown(e, dir)}
            onTouchStart={(e) => handleResizeTouchStart(e, dir)}
            style={{
              position: "absolute",
              left,
              top,
              width: 6,
              height: 6,
              transform: `translate(-50%, -50%) scale(${1 / scale})`,
              zIndex: Z.RESIZE_HANDLES,
              background: "white",
              border: "1px solid #007aff",
              cursor: CURSOR_MAP[dir],
              pointerEvents: "auto",
            }}
          />
        );
      })}
    </>
  );
};

// ─── Hover ring ───────────────────────────────────────────────────────────────

const HoverRing: React.FC<{ rect: Rect }> = ({ rect }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      zIndex: Z.HOVER_RING,
      outline: "2px solid #10b981",
      outlineOffset: "-1px",
      background: "rgba(16,185,129,0.05)",
    }}
  />
);

const DistanceGuide: React.FC<{ guide: DistanceGuideData }> = ({ guide }) => {
  const isHorizontal = guide.orientation === "horizontal";
  return (
    <>
      <div
        className="absolute pointer-events-none"
        style={{
          left: Math.min(guide.lineStart.x, guide.lineEnd.x),
          top: Math.min(guide.lineStart.y, guide.lineEnd.y),
          width: isHorizontal ? Math.abs(guide.lineEnd.x - guide.lineStart.x) : 1,
          height: isHorizontal ? 1 : Math.abs(guide.lineEnd.y - guide.lineStart.y),
          background: "#a855f7",
          zIndex: Z.SELECT_RING + 2,
        }}
      />
      <div
        className="absolute pointer-events-none text-[10px] leading-none px-1 py-0.5 rounded bg-[#a855f7] text-white"
        style={{
          left: guide.labelPos.x,
          top: guide.labelPos.y,
          transform: "translate(-50%, -50%)",
          zIndex: Z.SELECT_RING + 3,
        }}
      >
        {guide.value}px
      </div>
    </>
  );
};

function getDistanceGuides(a: Rect, b: Rect): DistanceGuideData[] {
  const guides: DistanceGuideData[] = [];

  const yOverlapStart = Math.max(a.y, b.y);
  const yOverlapEnd = Math.min(a.y + a.h, b.y + b.h);
  if (yOverlapEnd > yOverlapStart) {
    const y = (yOverlapStart + yOverlapEnd) / 2;
    if (a.x + a.w <= b.x) {
      const dist = Math.round(b.x - (a.x + a.w));
      if (dist > 0) {
        guides.push({
          orientation: "horizontal",
          value: dist,
          lineStart: { x: a.x + a.w, y },
          lineEnd: { x: b.x, y },
          labelPos: { x: (a.x + a.w + b.x) / 2, y: y - 10 },
        });
      }
    } else if (b.x + b.w <= a.x) {
      const dist = Math.round(a.x - (b.x + b.w));
      if (dist > 0) {
        guides.push({
          orientation: "horizontal",
          value: dist,
          lineStart: { x: b.x + b.w, y },
          lineEnd: { x: a.x, y },
          labelPos: { x: (b.x + b.w + a.x) / 2, y: y - 10 },
        });
      }
    }
  }

  const xOverlapStart = Math.max(a.x, b.x);
  const xOverlapEnd = Math.min(a.x + a.w, b.x + b.w);
  if (xOverlapEnd > xOverlapStart) {
    const x = (xOverlapStart + xOverlapEnd) / 2;
    if (a.y + a.h <= b.y) {
      const dist = Math.round(b.y - (a.y + a.h));
      if (dist > 0) {
        guides.push({
          orientation: "vertical",
          value: dist,
          lineStart: { x, y: a.y + a.h },
          lineEnd: { x, y: b.y },
          labelPos: { x: x + 14, y: (a.y + a.h + b.y) / 2 },
        });
      }
    } else if (b.y + b.h <= a.y) {
      const dist = Math.round(a.y - (b.y + b.h));
      if (dist > 0) {
        guides.push({
          orientation: "vertical",
          value: dist,
          lineStart: { x, y: b.y + b.h },
          lineEnd: { x, y: a.y },
          labelPos: { x: x + 14, y: (b.y + b.h + a.y) / 2 },
        });
      }
    }
  }

  return guides;
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export const EditorOverlay: React.FC<EditorOverlayProps> = ({
  artboardRef,
}) => {
  const selectedId = useEditorStore((s) => s.selectedId);
  const hoveredId = useEditorStore((s) => s.hoveredElementId);
  const elements = useEditorStore((s) => s.elements);
  const scale = useEditorStore((s) => s.camera.scale);

  // DOM-measured rects — only used as a fallback for flex/grid children.
  const [domSelectedRect, setDomSelectedRect] = React.useState<Rect | null>(
    null,
  );
  const [domHoveredRect, setDomHoveredRect] = React.useState<Rect | null>(null);
  const [domAltHoveredRect, setDomAltHoveredRect] = React.useState<Rect | null>(
    null,
  );
  const [isAltPressed, setIsAltPressed] = React.useState(false);
  const [altHoveredId, setAltHoveredId] = React.useState<string | null>(null);

  const selectedElement = selectedId ? elements[selectedId] : null;
  const hoveredElement = hoveredId ? elements[hoveredId] : null;

  // Compute positions directly from the store (no DOM, no animation lag).
  const selectedRect = selectedElement
    ? (computeRectFromStore(selectedElement, elements) ?? domSelectedRect)
    : null;
  const hoveredRect = hoveredElement
    ? (computeRectFromStore(hoveredElement, elements) ?? domHoveredRect)
    : null;
  const altHoveredElement = altHoveredId ? elements[altHoveredId] : null;
  const altHoveredRect = altHoveredElement
    ? (computeRectFromStore(altHoveredElement, elements) ?? domAltHoveredRect)
    : null;
  const distanceGuides =
    isAltPressed && selectedRect && altHoveredRect
      ? getDistanceGuides(selectedRect, altHoveredRect)
      : [];

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt") setIsAltPressed(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setIsAltPressed(false);
        setAltHoveredId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    if (!selectedId) {
      setAltHoveredId(null);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isAltPressed) {
        setAltHoveredId(null);
        return;
      }
      const target = e.target as HTMLElement | null;
      const host = target?.closest("[data-element-id]") as HTMLElement | null;
      const nextId = host?.dataset.elementId ?? null;
      setAltHoveredId(nextId && nextId !== selectedId ? nextId : null);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isAltPressed, selectedId]);

  // For flex/grid children only: measure via DOM after browser paint.
  React.useEffect(() => {
    const ab = artboardRef.current;
    if (!ab) return;

    const needsDomSelected =
      selectedElement &&
      computeRectFromStore(selectedElement, elements) === null;
    const needsDomHovered =
      hoveredElement && computeRectFromStore(hoveredElement, elements) === null;
    const needsDomAltHovered =
      altHoveredElement &&
      computeRectFromStore(altHoveredElement, elements) === null;

    if (!needsDomSelected && !needsDomHovered && !needsDomAltHovered) return;

    const rafId = requestAnimationFrame(() => {
      if (needsDomSelected) {
        setDomSelectedRect(measureFromDOM(selectedElement!.id, ab));
      }
      if (needsDomHovered) {
        setDomHoveredRect(measureFromDOM(hoveredElement!.id, ab));
      }
      if (needsDomAltHovered) {
        setDomAltHoveredRect(measureFromDOM(altHoveredElement!.id, ab));
      }
    });

    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, hoveredId, altHoveredId, elements, scale]);

  // Clear DOM rects when the selected/hovered element changes to an abs element.
  React.useEffect(() => {
    if (
      !selectedElement ||
      computeRectFromStore(selectedElement, elements) !== null
    ) {
      setDomSelectedRect(null);
    }
    if (
      !hoveredElement ||
      computeRectFromStore(hoveredElement, elements) !== null
    ) {
      setDomHoveredRect(null);
    }
    if (
      !altHoveredElement ||
      computeRectFromStore(altHoveredElement, elements) !== null
    ) {
      setDomAltHoveredRect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, hoveredId, altHoveredId]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: Z.SELECT_RING }}
    >
      {hoveredRect && hoveredId !== selectedId && (
        <HoverRing rect={hoveredRect} />
      )}
      {altHoveredRect && altHoveredId !== selectedId && (
        <HoverRing rect={altHoveredRect} />
      )}
      {distanceGuides.map((guide, idx) => (
        <DistanceGuide key={`${guide.orientation}-${idx}`} guide={guide} />
      ))}
      {selectedRect && selectedElement && (
        <SelectionChrome
          rect={selectedRect}
          scale={scale}
          element={selectedElement}
        />
      )}
    </div>
  );
};
