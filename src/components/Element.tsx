import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement as IEditorElement } from "@/lib/useEditorStore";

interface ElementProps {
  element: IEditorElement;
}

export const Element: React.FC<ElementProps> = ({ element }) => {
  const { selectedId, setSelectedId, updateElement, camera } = useEditorStore();
  const isSelected = selectedId === element.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    useEditorStore.getState().saveHistory(); // Snapshot before drag starts
    setSelectedId(element.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startElemX = element.props.x;
    const startElemY = element.props.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Compensate for camera scale to maintain 1:1 movement
      const deltaX = (moveEvent.clientX - startX) / camera.scale;
      const deltaY = (moveEvent.clientY - startY) / camera.scale;

      updateElement(element.id, {
        x: Math.round(startElemX + deltaX),
        y: Math.round(startElemY + deltaY),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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
            style={{
              color: props.color,
              fontSize: `${props.fontSize || 16}px`,
              lineHeight: 1.2,
            }}
            className="w-full h-full flex items-center justify-center p-2 text-center break-words"
          >
            {props.text || "Add text..."}
          </div>
        );
      case "button":
        return (
          <div
            className="w-full h-full shadow-sm flex items-center justify-center px-4 font-medium"
            style={{
              backgroundColor: props.background,
              color: props.color,
              borderRadius: `${props.borderRadius || 4}px`,
              fontSize: `${props.fontSize || 14}px`,
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
            }}
          />
        );
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
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
        transition-[ring] duration-75
        cursor-default
      `}
    >
      {renderContent()}

      {/* Professional Selection Chrome */}
      {isSelected && (
        <>
          {/* Edge line handles for visual clarity */}
          <div className="absolute -inset-[1px] border border-[#007aff] pointer-events-none" />

          {/* Resize Hubs - 6px squares */}
          {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((dir) => {
            const isCorner = dir.length === 2;
            return (
              <div
                key={dir}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  useEditorStore.getState().saveHistory(); // Snapshot before resize starts
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startW = element.props.width;
                  const startH = element.props.height;
                  const startEX = element.props.x;
                  const startEY = element.props.y;

                  const handleResize = (moveEvent: MouseEvent) => {
                    const dx = (moveEvent.clientX - startX) / camera.scale;
                    const dy = (moveEvent.clientY - startY) / camera.scale;

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

                    updateElement(element.id, updates);
                  };

                  const stopResize = () => {
                    window.removeEventListener("mousemove", handleResize);
                    window.removeEventListener("mouseup", stopResize);
                  };

                  window.addEventListener("mousemove", handleResize);
                  window.addEventListener("mouseup", stopResize);
                }}
                className={`
                  absolute w-[6px] h-[6px] bg-white border border-[#007aff] z-[110]
                  ${dir.includes("n") ? "-top-[3px]" : ""}
                  ${dir.includes("s") ? "-bottom-[3px]" : ""}
                  ${dir.includes("w") ? "-left-[3px]" : ""}
                  ${dir.includes("e") ? "-right-[3px]" : ""}
                  ${dir === "n" || dir === "s" ? "left-1/2 -translate-x-1/2" : ""}
                  ${dir === "w" || dir === "e" ? "top-1/2 -translate-y-1/2" : ""}
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
