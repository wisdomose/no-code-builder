import React, { useState } from "react";
import {
  Type,
  Square,
  Box,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement } from "@/lib/useEditorStore";

export const LayerTree: React.FC = () => {
  const { elements, selectedId, setSelectedId, removeElement, addElement } =
    useEditorStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["card-1", "card-2", "card-3", "card-4"]),
  );

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = (type: "text" | "button" | "container") => {
    const id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement = {
      id,
      type,
      parentId: selectedId || undefined,
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

  const renderElement = (element: EditorElement, level: number = 0) => {
    const children = elements.filter((el) => el.parentId === element.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(element.id);

    return (
      <React.Fragment key={element.id}>
        <div
          onClick={() => setSelectedId(element.id)}
          className={`
            group flex items-center gap-2 px-2 py-1 cursor-default text-[11px]
            ${selectedId === element.id ? "bg-[#007aff]/10 text-[#007aff] font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"}
            transition-colors
          `}
          style={{ paddingLeft: `${8 + level * 12}px` }}
        >
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            {hasChildren && (
              <button
                onClick={(e) => toggleExpand(element.id, e)}
                className="p-0.5 hover:bg-black/5 rounded transition-transform"
              >
                {isExpanded ? (
                  <ChevronDown size={10} />
                ) : (
                  <ChevronRight size={10} />
                )}
              </button>
            )}
          </div>
          <div className="shrink-0 opacity-60">
            {element.type === "text" && <Type size={12} />}
            {element.type === "button" && <Box size={12} />}
            {element.type === "container" && <Square size={12} />}
          </div>
          <span className="flex-1 truncate">
            {element.props.text || element.id}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
          >
            <Trash2 size={10} />
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="contents">
            {children.map((child) => renderElement(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  const rootElements = elements.filter((el) => !el.parentId);

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
          rootElements.map((el) => renderElement(el))
        )}
      </div>
    </div>
  );
};
