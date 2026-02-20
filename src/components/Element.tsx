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

    // Phase 2: visibility
    if (element.visible === false) return null;

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

    const { handleMouseDown, handleTouchStart } = useElementDrag(
      element,
      isParentFlow,
    );

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
                fontFamily: props.fontFamily,
                fontWeight: props.fontWeight,
                fontStyle: props.fontStyle,
                textDecoration: props.textDecoration,
                textTransform:
                  props.textTransform as React.CSSProperties["textTransform"],
                textAlign: props.textAlign,
                lineHeight: props.lineHeight,
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
                borderWidth: props.borderWidth
                  ? `${props.borderWidth}px`
                  : undefined,
                borderColor: props.borderColor,
                borderStyle: resolveBorderStyle(
                  props.borderStyle,
                  props.borderWidth,
                ),
                fontSize: `${props.fontSize || 14}px`,
                fontFamily: props.fontFamily,
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
              alt={element.name || "Element"}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                borderRadius: `${props.borderRadius || 0}px`,
                borderWidth: props.borderWidth
                  ? `${props.borderWidth}px`
                  : undefined,
                borderColor: props.borderColor,
                borderStyle: resolveBorderStyle(
                  props.borderStyle,
                  props.borderWidth,
                ),
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
                backgroundImage: props.backgroundImage,
                backgroundSize:
                  props.backgroundSize ??
                  (props.backgroundImage ? "cover" : undefined),
                backgroundPosition:
                  props.backgroundPosition ??
                  (props.backgroundImage ? "center center" : undefined),
                backgroundRepeat:
                  props.backgroundRepeat ??
                  (props.backgroundImage ? "no-repeat" : undefined),
                borderRadius: `${props.borderRadius || 0}px`,
                borderWidth: props.borderWidth
                  ? `${props.borderWidth}px`
                  : undefined,
                borderColor: props.borderColor,
                borderStyle: resolveBorderStyle(
                  props.borderStyle,
                  props.borderWidth,
                ),
                border:
                  !props.background &&
                  !props.borderWidth &&
                  !props.backgroundImage
                    ? "1px dashed #ccc"
                    : undefined,
                display: props.display || "flex",
                flexDirection: props.flexDirection,
                flexWrap: props.flexWrap,
                gridTemplateColumns: props.gridTemplateColumns,
                gridTemplateRows: props.gridTemplateRows,
                alignItems: props.alignItems,
                justifyContent: props.justifyContent,
                gap: `${props.gap || 0}px`,
                padding:
                  typeof props.padding === "number"
                    ? `${props.padding}px`
                    : props.padding,
                overflow: props.overflow,
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

    const content = (
      <div
        ref={(node) => {
          setElementRef(element.id, node);
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
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
          zIndex: isDragging
            ? Z.DRAG_GHOST
            : (element.props.zIndex ?? Z.ELEMENT),
          flexShrink: 0,
          alignSelf: element.props.alignSelf,
          transform: element.props.transform,
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
