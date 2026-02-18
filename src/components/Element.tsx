import React from "react";
import { useEditorStore } from "../lib/useEditorStore";
import type { EditorElement as IEditorElement } from "../lib/useEditorStore";

interface ElementProps {
  element: IEditorElement;
}

export const Element: React.FC<ElementProps> = ({ element }) => {
  const { selectedId, setSelectedId, updateElement, canvas } = useEditorStore();
  const isSelected = selectedId === element.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(element.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startElemX = element.props.x;
    const startElemY = element.props.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / canvas.scale;
      const deltaY = (moveEvent.clientY - startY) / canvas.scale;

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
          <div style={{ color: props.color }}>
            {props.text || "Double click to edit"}
          </div>
        );
      case "button":
        return (
          <button
            className="w-full h-full rounded shadow-sm flex items-center justify-center px-4"
            style={{ backgroundColor: props.background, color: props.color }}
          >
            {props.text || "Button"}
          </button>
        );
      case "image":
        return props.src ? (
          <img
            src={props.src}
            alt=""
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
            Image
          </div>
        );
      case "container":
      case "div":
      default:
        return (
          <div
            className="w-full h-full"
            style={{ backgroundColor: props.background }}
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
        group relative
        ${isSelected ? "ring-2 ring-primary ring-offset-0" : "hover:ring-1 hover:ring-primary/50"}
        cursor-move
      `}
    >
      {renderContent()}

      {/* Resize Handles (Simplified for now - bottom right) */}
      {isSelected && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.props.width;
            const startHeight = element.props.height;

            const handleResize = (moveEvent: MouseEvent) => {
              const deltaX = (moveEvent.clientX - startX) / canvas.scale;
              const deltaY = (moveEvent.clientY - startY) / canvas.scale;
              updateElement(element.id, {
                width: Math.max(10, Math.round(startWidth + deltaX)),
                height: Math.max(10, Math.round(startHeight + deltaY)),
              });
            };

            const stopResize = () => {
              window.removeEventListener("mousemove", handleResize);
              window.removeEventListener("mouseup", stopResize);
            };

            window.addEventListener("mousemove", handleResize);
            window.addEventListener("mouseup", stopResize);
          }}
          className="absolute -right-1 -bottom-1 w-3 h-3 bg-primary border border-background rounded-sm cursor-nwse-resize z-[100]"
        />
      )}
    </div>
  );
};
