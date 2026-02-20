import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement as IEditorElement } from "@/lib/useEditorStore";

interface ElementProps {
  element: IEditorElement;
}

const TextEditor = React.memo(
  ({
    initialText,
    style,
    className,
    onSave,
    onCancel,
  }: {
    initialText: string;
    style: React.CSSProperties;
    className: string;
    onSave: (text: string) => void;
    onCancel: () => void;
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (ref.current) {
        ref.current.innerText = initialText || "";
        ref.current.focus();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ref.current?.blur();
      }
      if (e.key === "Escape") {
        onCancel();
      }
    };

    const handleBlur = () => {
      if (ref.current) {
        onSave(ref.current.innerText);
      }
    };

    return (
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`${className} outline-none cursor-text ring-1 ring-primary ring-offset-2 ring-offset-background`}
        style={style}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    );
  },
);

TextEditor.displayName = "TextEditor";

// --- Hooks ---

/** #10: Granular drag hook — isolates drag logic and reads store fields it needs */
function useElementDrag(
  element: IEditorElement,
  isParentFlow: boolean,
  parent: IEditorElement | null,
) {
  const setSelectedId = useEditorStore((s) => s.setSelectedId);

  function getAllChildren(
    allElements: Record<string, IEditorElement>,
    parentId: string,
  ): IEditorElement[] {
    const children = Object.values(allElements)
      .filter((el) => el.parentId === parentId)
      .sort((a, b) => (a.index || 0) - (b.index || 0));
    return children.concat(
      children.flatMap((child) => getAllChildren(allElements, child.id)),
    );
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const store = useEditorStore.getState();
    if (store.editingId === element.id) return;
    if (e.button !== 0) return;
    e.stopPropagation();

    store.saveHistory();
    setSelectedId(element.id);

    const currentElements = store.elements;
    const startX = e.clientX;
    const startY = e.clientY;

    let startPropX = element.props.x;
    let startPropY = element.props.y;
    let flowStartX = startPropX;
    let flowStartY = startPropY;

    if (isParentFlow) {
      const rect = e.currentTarget.getBoundingClientRect();
      const currentCamera = store.camera;

      let newX = (rect.left - currentCamera.x) / currentCamera.scale;
      let newY = (rect.top - currentCamera.y) / currentCamera.scale;

      if (element.parentId) {
        const parentNode = document.querySelector(
          `[data-element-id="${element.parentId}"]`,
        );
        if (parentNode) {
          const parentRect = parentNode.getBoundingClientRect();
          const borderLeft = parent?.props.background ? 0 : 1;
          const borderTop = parent?.props.background ? 0 : 1;
          newX =
            (rect.left - parentRect.left) / currentCamera.scale - borderLeft;
          newY = (rect.top - parentRect.top) / currentCamera.scale - borderTop;
        }
      }

      flowStartX = newX;
      flowStartY = newY;
    }

    const affectedElements = [
      element,
      ...getAllChildren(currentElements, element.id),
    ];
    const affectedIds = new Set(affectedElements.map((el) => el.id));

    const startPositions = affectedElements.map((el) => ({
      id: el.id,
      x: el.id === element.id ? startPropX : el.props.x,
      y: el.id === element.id ? startPropY : el.props.y,
    }));

    let isDragStarted = false;
    // #12: RAF throttle for drop-target detection
    let rafId: number | null = null;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentCamera = useEditorStore.getState().camera;
      const dx = (moveEvent.clientX - startX) / currentCamera.scale;
      const dy = (moveEvent.clientY - startY) / currentCamera.scale;

      if (!isDragStarted) {
        if (
          Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 3
        ) {
          isDragStarted = true;
          store.setInteractionMode("dragging", element.id);

          if (isParentFlow) {
            startPropX = flowStartX;
            startPropY = flowStartY;
            store.updateElement(element.id, {
              x: flowStartX,
              y: flowStartY,
            });
          }
        } else {
          return;
        }
      }

      const updates = startPositions.map((pos) => ({
        id: pos.id,
        props: {
          x: Math.round(pos.x + dx),
          y: Math.round(pos.y + dy),
        },
      }));
      store.updateElements(updates);

      // #12: RAF-throttle the expensive drop-target detection
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const target = document.elementFromPoint(
          moveEvent.clientX,
          moveEvent.clientY,
        );
        const elementNode = target?.closest("[data-element-id]");
        const targetId = elementNode?.getAttribute("data-element-id");

        if (targetId && targetId !== element.id && !affectedIds.has(targetId)) {
          const potentialParent = useEditorStore.getState().elements[targetId];
          if (
            potentialParent &&
            (potentialParent.type === "container" ||
              potentialParent.type === "div")
          ) {
            store.setHoveredElementId(targetId);

            if (potentialParent.props.display === "flex") {
              const latestElements = useEditorStore.getState().elements;
              const siblings = Object.values(latestElements)
                .filter(
                  (el) => el.parentId === targetId && el.id !== element.id,
                )
                .sort((a, b) => (a.index || 0) - (b.index || 0));

              let foundIndex = siblings.length;
              for (let i = 0; i < siblings.length; i++) {
                const siblingNode = document.querySelector(
                  `[data-element-id="${siblings[i].id}"]`,
                );
                if (siblingNode) {
                  const rect = siblingNode.getBoundingClientRect();
                  const isRow = potentialParent.props.flexDirection === "row";
                  const center = isRow
                    ? rect.left + rect.width / 2
                    : rect.top + rect.height / 2;
                  const mousePos = isRow
                    ? moveEvent.clientX
                    : moveEvent.clientY;
                  if (mousePos < center) {
                    foundIndex = i;
                    break;
                  }
                }
              }
              store.setInsertIndex(foundIndex);
            } else {
              store.setInsertIndex(null);
            }
          } else {
            store.setHoveredElementId(null);
            store.setInsertIndex(null);
          }
        } else {
          store.setHoveredElementId(null);
          store.setInsertIndex(null);
        }
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (!isDragStarted) return;

      const finalState = useEditorStore.getState();
      const finalHoveredId = finalState.hoveredElementId;
      const latestElements = finalState.elements;

      if (finalHoveredId) {
        const parentEl = latestElements[finalHoveredId];
        const isFlex = parentEl?.props.display === "flex";
        if (isFlex) {
          const index = finalState.insertIndex ?? 0;
          store.reorderElement(element.id, finalHoveredId, index);
        } else {
          store.reparentElement(element.id, finalHoveredId);
        }
      } else {
        store.reparentElement(element.id, undefined);
      }

      store.setHoveredElementId(null);
      store.setInsertIndex(null);
      store.setInteractionMode("idle");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return { handleMouseDown };
}

/** #8 extracted resize hook */
function useElementResize(element: IEditorElement) {
  const handleResizeMouseDown = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    const store = useEditorStore.getState();
    store.saveHistory();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW =
      typeof element.props.width === "number" ? element.props.width : 100;
    const startH =
      typeof element.props.height === "number" ? element.props.height : 100;
    const startEX = element.props.x;
    const startEY = element.props.y;

    const handleResize = (moveEvent: MouseEvent) => {
      const currentCamera = useEditorStore.getState().camera;
      const dx = (moveEvent.clientX - startX) / currentCamera.scale;
      const dy = (moveEvent.clientY - startY) / currentCamera.scale;

      const updates: Partial<IEditorElement["props"]> = {};

      if (dir.includes("e"))
        updates.width = Math.max(10, Math.round(startW + dx));
      if (dir.includes("s"))
        updates.height = Math.max(10, Math.round(startH + dy));
      if (dir.includes("w")) {
        const newW = Math.max(10, startW - dx);
        updates.width = newW;
        updates.x = startEX + (startW - newW);
      }
      if (dir.includes("n")) {
        const newH = Math.max(10, startH - dy);
        updates.height = newH;
        updates.y = startEY + (startH - newH);
      }

      useEditorStore.getState().updateElement(element.id, updates);
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
  };

  return { handleResizeMouseDown };
}

// --- Main Component ---

export const Element: React.FC<ElementProps> = React.memo(
  ({ element: initialElement }) => {
    // #10: Granular selectors — only re-renders when THIS element's data changes
    const element = useEditorStore(
      (s) => s.elements[initialElement.id] || initialElement,
    );
    const isSelected = useEditorStore((s) => s.selectedId === element.id);
    const isEditing = useEditorStore((s) => s.editingId === element.id);
    const isHoveredAsParent = useEditorStore(
      (s) => s.hoveredElementId === element.id,
    );
    const isDragging = useEditorStore(
      (s) =>
        s.interactionState.mode === "dragging" &&
        s.interactionState.activeId === element.id,
    );
    const insertIndex = useEditorStore((s) => s.insertIndex);
    const cameraScale = useEditorStore((s) => s.camera.scale);
    const setEditingId = useEditorStore((s) => s.setEditingId);
    const updateElement = useEditorStore((s) => s.updateElement);

    // #11: Memoize child elements to avoid O(n) on every render
    const elements = useEditorStore((s) => s.elements);
    const directChildren = React.useMemo(
      () =>
        Object.values(elements)
          .filter((el) => el.parentId === element.id)
          .sort((a, b) => (a.index || 0) - (b.index || 0)),
      [elements, element.id],
    );

    const parent = element.parentId ? elements[element.parentId] : null;
    const isParentFlow =
      parent?.props.display === "flex" || parent?.props.display === "grid";

    const { handleMouseDown } = useElementDrag(element, isParentFlow, parent);
    const { handleResizeMouseDown } = useElementResize(element);

    const renderContent = () => {
      const { type, props } = element;
      switch (type) {
        case "text":
          if (isEditing) {
            return (
              <TextEditor
                initialText={props.text || ""}
                className="w-full h-full min-h-[1em]"
                style={{
                  color: props.color,
                  fontSize: `${props.fontSize || 14}px`,
                  fontWeight: props.fontWeight,
                  textAlign: props.textAlign,
                  letterSpacing: props.letterSpacing,
                  opacity: props.opacity,
                }}
                onSave={(newText) => {
                  updateElement(element.id, { text: newText });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            );
          }
          return (
            <div
              className="w-full h-full"
              style={{
                color: props.color,
                fontSize: `${props.fontSize || 14}px`,
                fontWeight: props.fontWeight,
                textAlign: props.textAlign,
                letterSpacing: props.letterSpacing,
                opacity: props.opacity,
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingId(element.id);
              }}
            >
              {props.text || "Type something..."}
            </div>
          );
        case "button":
          return (
            <div
              className="w-full h-full flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              style={{
                backgroundColor: props.background,
                color: props.color,
                borderRadius: `${props.borderRadius || 4}px`,
                fontSize: `${props.fontSize || 14}px`,
                fontWeight: props.fontWeight,
                opacity: props.opacity,
                boxShadow: props.boxShadow,
              }}
            >
              {props.text || "Button"}
            </div>
          );
        case "image":
          return (
            <img
              src={props.src || "https://placehold.co/400x300?text=Image"}
              alt="Element"
              className="w-full h-full object-cover pointer-events-none"
              style={{
                borderRadius: `${props.borderRadius || 0}px`,
                opacity: props.opacity,
                boxShadow: props.boxShadow,
              }}
            />
          );
        case "container":
        case "div":
        default:
          return (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: props.background,
                borderRadius: `${props.borderRadius || 0}px`,
                border: props.background ? "none" : "1px dashed #ccc",
                display: props.display || "flex",
                flexDirection: props.flexDirection,
                gridTemplateColumns: props.gridTemplateColumns,
                gridTemplateRows: props.gridTemplateRows,
                alignItems: props.alignItems,
                justifyContent: props.justifyContent,
                gap: `${props.gap || 0}px`,
                padding:
                  typeof props.padding === "number"
                    ? `${props.padding}px`
                    : props.padding,
                opacity: props.opacity,
                boxShadow: props.boxShadow,
              }}
            >
              {directChildren.map((el, idx) => (
                <React.Fragment key={el.id}>
                  {/* Insertion Indicator */}
                  {isHoveredAsParent && insertIndex === idx && (
                    <div
                      className={`
                         ${props.flexDirection === "row" ? "w-[4px] h-full mx-[-2px]" : "h-[4px] w-full my-[-2px]"}
                         bg-[#007aff] rounded-full z-50 pointer-events-none transition-all
                     `}
                    />
                  )}
                  <Element element={el} />
                </React.Fragment>
              ))}
              {/* Final Insertion Indicator */}
              {isHoveredAsParent && insertIndex === directChildren.length && (
                <div
                  className={`
                      ${props.flexDirection === "row" ? "w-[4px] h-full mx-[-2px]" : "h-[4px] w-full my-[-2px]"}
                      bg-[#007aff] rounded-full z-50 pointer-events-none transition-all
                  `}
                />
              )}
            </div>
          );
      }
    };

    return (
      <div
        onMouseDown={handleMouseDown}
        data-element-id={element.id}
        style={{
          position: isDragging || !isParentFlow ? "absolute" : "relative",
          left:
            isDragging || !isParentFlow ? `${element.props.x}px` : undefined,
          top: isDragging || !isParentFlow ? `${element.props.y}px` : undefined,
          width:
            element.props.width === "auto"
              ? "auto"
              : `${element.props.width}px`,
          height:
            element.props.height === "auto"
              ? "auto"
              : `${element.props.height}px`,
          zIndex: isDragging ? 200 : element.props.zIndex || 1,
          flexShrink: 0,
        }}
        className={`
        group pointer-events-auto
        ${isSelected ? "ring-1 ring-[#007aff] z-[100]" : "hover:ring-1 hover:ring-[#007aff]/50"}
        ${isHoveredAsParent ? "ring-2 ring-emerald-500 bg-emerald-500/5 z-[90]" : ""}
        ${isDragging ? "pointer-events-none opacity-50" : ""}
        transition-[ring,background-color,opacity] duration-150
        cursor-default
      `}
      >
        {renderContent()}

        {/* Selection Chrome */}
        {isSelected && (
          <>
            <div className="absolute -inset-[1px] border border-[#007aff] pointer-events-none" />

            {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((dir) => {
              const isCorner = dir.length === 2;
              return (
                <div
                  key={dir}
                  onMouseDown={(e) => handleResizeMouseDown(e, dir)}
                  style={{
                    transform: `translate(-50%, -50%) scale(${1 / cameraScale})`,
                  }}
                  className={`
                  absolute w-[6px] h-[6px] bg-white border border-[#007aff] z-[110]
                  ${dir.includes("n") ? "top-0" : ""}
                  ${dir.includes("s") ? "top-full" : ""}
                  ${dir.includes("w") ? "left-0" : ""}
                  ${dir.includes("e") ? "left-full" : ""}
                  ${dir === "n" || dir === "s" ? "left-1/2" : ""}
                  ${dir === "w" || dir === "e" ? "top-1/2" : ""}
                  ${dir === "nw" || dir === "se" ? "cursor-nwse-resize" : ""}
                  ${dir === "ne" || dir === "sw" ? "cursor-nesw-resize" : ""}
                  ${dir === "n" || dir === "s" ? "cursor-ns-resize" : ""}
                  ${dir === "w" || dir === "e" ? "cursor-ew-resize" : ""}
                  ${isCorner ? "" : "hidden group-hover:block"}
                `}
                />
              );
            })}
          </>
        )}
      </div>
    );
  },
);

Element.displayName = "Element";
