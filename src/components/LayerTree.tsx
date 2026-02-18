import React from "react";
import { useEditorStore } from "../lib/useEditorStore";
import {
  Type,
  Square,
  MousePointer2,
  Image as ImageIcon,
  Box,
} from "lucide-react";

export const LayerTree: React.FC = () => {
  const { elements, selectedId, setSelectedId, removeElement } =
    useEditorStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type size={14} />;
      case "image":
        return <ImageIcon size={14} />;
      case "button":
        return <MousePointer2 size={14} />;
      case "container":
        return <Box size={14} />;
      default:
        return <Square size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {elements.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            No elements yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {elements.map((el) => (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`
                  group flex items-center gap-2 px-3 py-1.5 cursor-pointer text-sm transition-colors
                  ${selectedId === el.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"}
                `}
              >
                <div className="shrink-0 text-muted-foreground/50">
                  {getIcon(el.type)}
                </div>
                <span className="truncate flex-1">
                  {el.type} - {el.id.slice(0, 4)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(el.id);
                  }}
                  className="hidden group-hover:block p-1 hover:text-destructive transition-colors"
                >
                  <Square size={12} className="rotate-45" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Element Quick Actions */}
      <div className="p-3 border-t border-border bg-muted/20 flex flex-col gap-3 shrink-0">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Quick Add
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const id = Math.random().toString(36).substring(7);
              useEditorStore.getState().addElement({
                id,
                type: "text",
                props: {
                  x: 100,
                  y: 100,
                  width: 200,
                  height: 40,
                  text: "New Text",
                  color: "#333333",
                },
              });
              setSelectedId(id);
            }}
            className="p-1.5 hover:bg-muted bg-background rounded border border-border flex items-center gap-1.5 text-[10px]"
          >
            <Type size={12} /> Text
          </button>
          <button
            onClick={() => {
              const id = Math.random().toString(36).substring(7);
              useEditorStore.getState().addElement({
                id,
                type: "button",
                props: {
                  x: 150,
                  y: 150,
                  width: 120,
                  height: 40,
                  text: "Action",
                  background: "#2563eb",
                  color: "#ffffff",
                },
              });
              setSelectedId(id);
            }}
            className="p-1.5 hover:bg-muted bg-background rounded border border-border flex items-center gap-1.5 text-[10px]"
          >
            <MousePointer2 size={12} /> Button
          </button>
          <button
            onClick={() => {
              const id = Math.random().toString(36).substring(7);
              useEditorStore.getState().addElement({
                id,
                type: "container",
                props: {
                  x: 50,
                  y: 50,
                  width: 300,
                  height: 200,
                  background: "#f8fafc",
                },
              });
              setSelectedId(id);
            }}
            className="p-1.5 hover:bg-muted bg-background rounded border border-border flex items-center gap-1.5 text-[10px]"
          >
            <Box size={12} /> Div
          </button>
          <button
            onClick={() => {
              if (confirm("Clear all elements?")) {
                useEditorStore.setState({ elements: [], selectedId: null });
              }
            }}
            className="p-1.5 hover:bg-destructive/10 bg-background rounded border border-border flex items-center gap-1.5 text-[10px] text-destructive"
          >
            <Square size={12} className="rotate-45" /> Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
