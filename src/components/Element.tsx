import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement as IEditorElement } from "@/lib/useEditorStore";

interface ElementProps {
  element: IEditorElement;
}

export const Element: React.FC<ElementProps> = ({
  element: initialElement,
}) => {
  const element = useEditorStore(
    (state) =>
      state.elements.find((el) => el.id === initialElement.id) ||
      initialElement,
  );
  const {
    selectedId,
    setSelectedId,
    camera,
    hoveredElementId,
    draggingId,
    setDraggingId,
  } = useEditorStore();
  const isSelected = selectedId === element.id;
  const isHoveredAsParent = hoveredElementId === element.id;
  const isDragging = draggingId === element.id;

  const getAllChildren = (
    allElements: IEditorElement[],
    parentId: string,
  ): IEditorElement[] => {
    const children = allElements.filter((el) => el.parentId === parentId);
    return children.concat(
      children.flatMap((child) => getAllChildren(allElements, child.id)),
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    const store = useEditorStore.getState();
    const currentElements = store.elements;

    store.saveHistory();
    setSelectedId(element.id);
    setDraggingId(element.id);

    const startX = e.clientX;
    const startY = e.clientY;

    const affectedElements = [
      element,
      ...getAllChildren(currentElements, element.id),
    ];
    const affectedIds = new Set(affectedElements.map((el) => el.id));

    const startPositions = affectedElements.map((el) => ({
      id: el.id,
      x: el.props.x,
      y: el.props.y,
    }));

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentCamera = useEditorStore.getState().camera;
      const deltaX = (moveEvent.clientX - startX) / currentCamera.scale;
      const deltaY = (moveEvent.clientY - startY) / currentCamera.scale;

      const updates = startPositions.map((pos) => ({
        id: pos.id,
        props: {
          x: Math.round(pos.x + deltaX),
          y: Math.round(pos.y + deltaY),
        },
      }));

      store.updateElements(updates);

      // --- Drop Target Detection ---
      // We need to find if the mouse is over a potential container
      // Use document.elementFromPoint and then find the corresponding ID
      const target = document.elementFromPoint(
        moveEvent.clientX,
        moveEvent.clientY,
      );
      const elementNode = target?.closest("[data-element-id]");
      const targetId = elementNode?.getAttribute("data-element-id");

      if (targetId && targetId !== element.id && !affectedIds.has(targetId)) {
        const potentialParent = currentElements.find(
          (el) => el.id === targetId,
        );
        if (
          potentialParent &&
          (potentialParent.type === "container" ||
            potentialParent.type === "div")
        ) {
          store.setHoveredElementId(targetId);
        } else {
          store.setHoveredElementId(null);
        }
      } else {
        store.setHoveredElementId(null);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      const finalHoveredId = useEditorStore.getState().hoveredElementId;
      if (finalHoveredId) {
        store.reparentElement(element.id, finalHoveredId);
      } else {
        // Drop to root if outside
        store.reparentElement(element.id, undefined);
      }

      store.setHoveredElementId(null);
      store.setDraggingId(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const renderContent = () => {
    const { type, props } = element;
    switch (type) {
      case "text":
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
          />
        );
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      data-element-id={element.id}
      style={{
        position: "absolute",
        left: `${element.props.x}px`,
        top: `${element.props.y}px`,
        width: `${element.props.width}px`,
        height: `${element.props.height}px`,
        zIndex: element.props.zIndex || 1,
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

      {/* Professional Selection Chrome */}
      {isSelected && (
        <>
          {/* Edge line handles for visual clarity */}
          <div className="absolute -inset-[1px] border border-[#007aff] pointer-events-none" />

          {/* Resize Hubs - Maintain constant visual size */}
          {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((dir) => {
            const isCorner = dir.length === 2;
            return (
              <div
                key={dir}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const store = useEditorStore.getState();
                  store.saveHistory();

                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startW = element.props.width;
                  const startH = element.props.height;
                  const startEX = element.props.x;
                  const startEY = element.props.y;

                  const handleResize = (moveEvent: MouseEvent) => {
                    const currentCamera = useEditorStore.getState().camera;
                    const dx =
                      (moveEvent.clientX - startX) / currentCamera.scale;
                    const dy =
                      (moveEvent.clientY - startY) / currentCamera.scale;

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

                    useEditorStore
                      .getState()
                      .updateElement(element.id, updates);
                  };

                  const stopResize = () => {
                    window.removeEventListener("mousemove", handleResize);
                    window.removeEventListener("mouseup", stopResize);
                  };

                  window.addEventListener("mousemove", handleResize);
                  window.addEventListener("mouseup", stopResize);
                }}
                style={{
                  transform: `translate(-50%, -50%) scale(${1 / camera.scale})`,
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
};
