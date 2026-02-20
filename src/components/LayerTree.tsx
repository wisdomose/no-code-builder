import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement } from "@/lib/useEditorStore";
import {
  ChevronRight,
  Type,
  Image as ImageIcon,
  Box,
  Layers as LayersIcon,
} from "lucide-react";

function getIcon(type: string) {
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
}

function LayerItem({
  el,
  depth,
  selectedId,
  onSelect,
  elements,
}: {
  el: EditorElement;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  elements: Record<string, EditorElement>;
}) {
  const isSelected = selectedId === el.id;
  const children = Object.values(elements)
    .filter((child) => child.parentId === el.id)
    .sort((a, b) => (a.index || 0) - (b.index || 0));
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        onClick={() => onSelect(el.id)}
        className={`
          flex items-center gap-2 py-1.5 cursor-pointer group select-none
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
      </div>

      {children.map((child) => (
        <LayerItem
          key={child.id}
          el={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          elements={elements}
        />
      ))}
    </div>
  );
}

export const LayerTree: React.FC = () => {
  const { elements, selectedId, setSelectedId } = useEditorStore();
  const rootElements = React.useMemo(
    () =>
      Object.values(elements)
        .filter((el) => !el.parentId)
        .sort((a, b) => (a.index || 0) - (b.index || 0)),
    [elements],
  );

  return (
    <div className="flex-1 overflow-auto no-scrollbar">
      {rootElements.map((el) => (
        <LayerItem
          key={el.id}
          el={el}
          depth={0}
          selectedId={selectedId}
          onSelect={setSelectedId}
          elements={elements}
        />
      ))}
    </div>
  );
};
