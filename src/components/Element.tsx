import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement as IEditorElement } from "@/lib/useEditorStore";
import { useElementDrag } from "@/hooks/useElementDrag";
import { TextEditor } from "./TextEditor";
import { Z } from "@/lib/layers";
import { setElementRef } from "@/lib/useEditorStore";

function resolveBorderStyle(style?: string, width?: number) {
  return style ?? (width ? "solid" : undefined);
}

interface ElementProps {
  element: IEditorElement;
}

// --- Main Component ---

export const Element: React.FC<ElementProps> = React.memo(
  ({ element: initialElement }) => {
    const element = useEditorStore(
      (s) => s.elements[initialElement.id] || initialElement,
    );
    const isEditing = useEditorStore((s) => s.editingId === element.id);
    const isDragging = useEditorStore(
      (s) =>
        s.interactionState.mode === "dragging" &&
        s.interactionState.activeId === element.id,
    );
    const insertIndex = useEditorStore((s) => s.insertIndex);
    const isHoveredAsParent = useEditorStore(
      (s) => s.hoveredElementId === element.id,
    );
    const setEditingId = useEditorStore((s) => s.setEditingId);
    const updateElement = useEditorStore((s) => s.updateElement);
    const elements = useEditorStore((s) => s.elements);

    const directChildren = React.useMemo(
      () =>
        (element.children || [])
          .map((id) => elements[id])
          .filter(Boolean) as IEditorElement[],
      [elements, element.children],
    );

    // Phase 2: visibility
    if (element.visible === false) return null;

    const parent = element.parentId ? elements[element.parentId] : null;
    const isParentFlow =
      parent?.layout?.display === "flex" || parent?.layout?.display === "grid";

    const { handleMouseDown, handleTouchStart } = useElementDrag(
      element,
      isParentFlow,
    );

    const fillWidth =
      typeof element.layout.width === "number" ? "w-full" : "w-auto";
    const fillHeight =
      typeof element.layout.height === "number" ? "h-full" : "h-auto";

    const renderContent = () => {
      const { type, layout, style, content } = element;
      switch (type) {
        case "text":
          if (isEditing) {
            return (
              <TextEditor
                initialText={content || ""}
                className={`${fillWidth} ${fillHeight} min-h-[1em]`}
                style={{
                  color: style.color,
                  fontSize: `${style.fontSize || 14}px`,
                  fontWeight: style.fontWeight,
                  textAlign: style.textAlign,
                  letterSpacing: style.letterSpacing,
                  opacity: style.opacity,
                }}
                onSave={(newText) => {
                  updateElement(element.id, undefined, undefined, newText);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            );
          }
          return (
            <div
              className={`${fillWidth} ${fillHeight}`}
              style={{
                color: style.color,
                fontSize: `${style.fontSize || 14}px`,
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                fontStyle: style.fontStyle,
                textDecoration: style.textDecoration,
                textTransform:
                  style.textTransform as React.CSSProperties["textTransform"],
                textAlign: style.textAlign,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing,
                opacity: style.opacity,
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingId(element.id);
              }}
            >
              {content || "Type something..."}
            </div>
          );
        case "button":
          return (
            <div
              className={`${fillWidth} ${fillHeight} flex items-center justify-center transition-all active:scale-95 cursor-pointer`}
              style={{
                backgroundColor: style.background,
                color: style.color,
                borderRadius: `${style.borderRadius || 4}px`,
                borderWidth: style.borderWidth
                  ? `${style.borderWidth}px`
                  : undefined,
                borderColor: style.borderColor,
                borderStyle: resolveBorderStyle(
                  style.borderStyle,
                  style.borderWidth,
                ),
                fontSize: `${style.fontSize || 14}px`,
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                opacity: style.opacity,
                boxShadow: style.boxShadow,
              }}
            >
              {content || "Button"}
            </div>
          );
        case "image":
          return (
            <img
              src={content || "https://placehold.co/400x300?text=Image"}
              alt={element.name || "Element"}
              className={`${fillWidth} ${fillHeight} object-cover pointer-events-none`}
              style={{
                borderRadius: `${style.borderRadius || 0}px`,
                borderWidth: style.borderWidth
                  ? `${style.borderWidth}px`
                  : undefined,
                borderColor: style.borderColor,
                borderStyle: resolveBorderStyle(
                  style.borderStyle,
                  style.borderWidth,
                ),
                opacity: style.opacity,
                boxShadow: style.boxShadow,
              }}
            />
          );
        case "container":
        case "div":
        default:
          return (
            <div
              className={`${fillWidth} ${fillHeight}`}
              style={{
                backgroundColor: style.background,
                backgroundImage: style.backgroundImage,
                backgroundSize:
                  style.backgroundSize ??
                  (style.backgroundImage ? "cover" : undefined),
                backgroundPosition:
                  style.backgroundPosition ??
                  (style.backgroundImage ? "center center" : undefined),
                backgroundRepeat:
                  style.backgroundRepeat ??
                  (style.backgroundImage ? "no-repeat" : undefined),
                borderRadius: `${style.borderRadius || 0}px`,
                borderWidth: style.borderWidth
                  ? `${style.borderWidth}px`
                  : undefined,
                borderColor: style.borderColor,
                borderStyle: resolveBorderStyle(
                  style.borderStyle,
                  style.borderWidth,
                ),
                border:
                  !style.background &&
                  !style.borderWidth &&
                  !style.backgroundImage &&
                  directChildren.length === 0
                    ? "1px dashed #ccc"
                    : undefined,
                display: layout.display || "flex",
                flexDirection: layout.flexDirection,
                flexWrap: layout.flexWrap,
                gridTemplateColumns: layout.gridTemplateColumns,
                gridTemplateRows: layout.gridTemplateRows,
                alignItems: layout.alignItems,
                justifyContent: layout.justifyContent,
                gap: `${layout.gap || 0}px`,
                padding:
                  typeof layout.padding === "number"
                    ? `${layout.padding}px`
                    : layout.padding,
                overflow: layout.overflow,
                opacity: style.opacity,
                boxShadow: style.boxShadow,
              }}
            >
              {directChildren.map((el, idx) => (
                <React.Fragment key={el.id}>
                  {isHoveredAsParent && insertIndex === idx && (
                    <div
                      className={`
                        ${layout.flexDirection === "row" ? "w-1 h-full -mx-0.5" : "h-1 w-full -my-0.5"}
                        bg-[#007aff] rounded-full z-50 pointer-events-none transition-all
                    `}
                    />
                  )}
                  <Element element={el} />
                </React.Fragment>
              ))}
              {isHoveredAsParent && insertIndex === directChildren.length && (
                <div
                  className={`
                      ${layout.flexDirection === "row" ? "w-1 h-full -mx-0.5" : "h-1 w-full -my-0.5"}
                      bg-[#007aff] rounded-full z-50 pointer-events-none transition-all
                  `}
                />
              )}
            </div>
          );
      }
    };

    const content = (
      <div
        ref={(node) => {
          setElementRef(element.id, node);
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        data-element-id={element.id}
        style={{
          position:
            isDragging ||
            !element.parentId ||
            element.layout.position === "absolute"
              ? "absolute"
              : "relative",
          left:
            isDragging ||
            !element.parentId ||
            element.layout.position === "absolute"
              ? `${element.layout.x ?? 0}px`
              : undefined,
          top:
            isDragging ||
            !element.parentId ||
            element.layout.position === "absolute"
              ? `${element.layout.y ?? 0}px`
              : undefined,
          width:
            element.layout.width === "auto"
              ? "auto"
              : element.layout.width === "100%"
                ? "100%"
                : `${element.layout.width}px`,
          height:
            element.layout.height === "auto"
              ? "auto"
              : element.layout.height === "100%"
                ? "100%"
                : `${element.layout.height}px`,
          zIndex: isDragging
            ? Z.DRAG_GHOST
            : (element.layout.zIndex ?? Z.ELEMENT),
          flexShrink: 0,
          alignSelf: element.layout.alignSelf,
          transform: element.style.transform,
          cursor: element.locked ? "not-allowed" : "default",
          touchAction: "none",
        }}
        className={`
        pointer-events-auto
        ${isDragging ? "opacity-50" : ""}
        transition-opacity duration-150
        cursor-default
      `}
      >
        {renderContent()}
      </div>
    );

    // We no longer portal the element because React unmounting it cancels active touch events.
    return content;
  },
);

Element.displayName = "Element";
