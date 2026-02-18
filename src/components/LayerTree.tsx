import React from "react";
import { Type, Square, Box, Trash2 } from "lucide-react";
import { useEditorStore } from "@/lib/useEditorStore";

export const LayerTree: React.FC = () => {
  const { elements, selectedId, setSelectedId, removeElement, addElement } =
    useEditorStore();

  const handleAdd = (type: "text" | "button" | "container") => {
    const id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement = {
      id,
      type,
      props: {
        x: 100,
        y: 100,
        width: type === "text" ? 200 : 150,
        height: type === "text" ? 40 : 100,
        text:
          type === "text" ? "New Text" : type === "button" ? "Click Me" : "",
        background:
          type === "text"
            ? "transparent"
            : type === "button"
              ? "#007aff"
              : "#f0f0f0",
        color: type === "button" ? "#ffffff" : "#000000",
        fontSize: 14,
        borderRadius: type === "button" ? 8 : 0,
      },
    };
    addElement(newElement as any);
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col h-full bg-card select-none">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Layers
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => handleAdd("text")}
            className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
            title="Add Text"
          >
            <Type size={12} />
          </button>
          <button
            onClick={() => handleAdd("container")}
            className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
            title="Add Container"
          >
            <Square size={12} />
          </button>
          <button
            onClick={() => handleAdd("button")}
            className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
            title="Add Button"
          >
            <Box size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-1">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-[11px] text-muted-foreground italic">
            No layers yet
          </div>
        ) : (
          elements.map((el) => (
            <div
              key={el.id}
              onClick={() => setSelectedId(el.id)}
              className={`
                group flex items-center gap-2 px-2 py-1 cursor-default text-[11px]
                ${selectedId === el.id ? "bg-[#007aff]/10 text-[#007aff] font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"}
              `}
            >
              <div className="shrink-0 opacity-60">
                {el.type === "text" && <Type size={12} />}
                {el.type === "button" && <Box size={12} />}
                {el.type === "container" && <Square size={12} />}
              </div>
              <span className="flex-1 truncate">{el.props.text || el.id}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(el.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
