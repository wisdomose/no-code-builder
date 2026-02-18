import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import {
  ChevronRight,
  Type,
  Image as ImageIcon,
  Box,
  Layers as LayersIcon,
  Eye,
  Lock,
} from "lucide-react";

export const LayerTree: React.FC = () => {
  const { elements, selectedId, setSelectedId } = useEditorStore();

  const renderItem = (el: any, depth = 0) => {
    const isSelected = selectedId === el.id;
    const hasChildren = elements.some((child) => child.parentId === el.id);

    const getIcon = (type: string) => {
      switch (type) {
        case "text":
          return <Type size={12} />;
        case "image":
          return <ImageIcon size={12} />;
        case "container":
          return <Box size={12} />;
        default:
          return <LayersIcon size={12} />;
      }
    };

    return (
      <div key={el.id}>
        <div
          onClick={() => setSelectedId(el.id)}
          className={`
            flex items-center gap-2 py-1.5 px-3 cursor-pointer group select-none
            ${isSelected ? "bg-primary/20 border-l-2 border-primary" : "hover:bg-background/50 hover:border-l-2 hover:border-border/50 border-l-2 border-transparent"}
            transition-all duration-75
          `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {hasChildren ? (
            <ChevronRight
              size={10}
              className="text-text-muted transform rotate-90"
            />
          ) : (
            <div className="w-2.5" />
          )}

          <span
            className={`${isSelected ? "text-primary" : "text-text-muted"} group-hover:text-text-main transition-colors`}
          >
            {getIcon(el.type)}
          </span>

          <span
            className={`text-[12px] font-medium truncate flex-1 ${isSelected ? "text-text-main" : "text-text-muted group-hover:text-text-main"}`}
          >
            {el.id}
          </span>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={12} className="text-text-muted hover:text-text-main" />
            <Lock size={12} className="text-text-muted hover:text-text-main" />
          </div>
        </div>

        {/* Render Children Recursively */}
        {elements
          .filter((child) => child.parentId === el.id)
          .map((child) => renderItem(child, depth + 1))}
      </div>
    );
  };

  // Render top-level elements first
  const rootElements = elements.filter((el) => !el.parentId);

  return (
    <div className="flex-1 overflow-auto no-scrollbar">
      {rootElements.map((el) => renderItem(el))}
    </div>
  );
};
