import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import type { EditorElement } from "@/lib/useEditorStore";
import {
  ChevronRight,
  Type,
  Image as ImageIcon,
  Box,
  Layers as LayersIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
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
  const updateElementMeta = useEditorStore((s) => s.updateElementMeta);

  const isSelected = selectedId === el.id;
  const isVisible = el.visible !== false;
  const isLocked = el.locked === true;
  const displayName = el.name || el.id;

  const children = Object.values(elements)
    .filter((child) => child.parentId === el.id)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  return (
    <div>
      <div
        onClick={() => {
          if (!isLocked) onSelect(el.id);
        }}
        className={`
          flex items-center gap-2 py-1.5 cursor-pointer group select-none pr-2
          ${isSelected ? "bg-primary/20 border-l-2 border-primary" : "hover:bg-background/50 hover:border-l-2 hover:border-border/50 border-l-2 border-transparent"}
          ${!isVisible ? "opacity-40" : ""}
          transition-all duration-75
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {children.length > 0 ? (
          <ChevronRight
            size={10}
            className="text-text-muted transform rotate-90 shrink-0"
          />
        ) : (
          <div className="w-2.5 shrink-0" />
        )}

        <span
          className={`${isSelected ? "text-primary" : "text-text-muted"} group-hover:text-text-main transition-colors shrink-0`}
        >
          {getIcon(el.type)}
        </span>

        <span
          className={`text-[12px] font-medium truncate flex-1 min-w-0 ${
            isSelected
              ? "text-text-main"
              : "text-text-muted group-hover:text-text-main"
          } ${isLocked ? "italic" : ""}`}
          title={el.id}
        >
          {displayName}
        </span>

        {/* Visibility + Lock toggles */}
        <div
          className={`flex items-center gap-1 shrink-0 ${!isVisible || isLocked ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateElementMeta(el.id, { visible: !isVisible });
            }}
            className="p-0.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            title={isVisible ? "Hide" : "Show"}
          >
            {isVisible ? (
              <Eye size={11} />
            ) : (
              <EyeOff size={11} className="text-text-muted/50" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateElementMeta(el.id, { locked: !isLocked });
            }}
            className="p-0.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            title={isLocked ? "Unlock" : "Lock"}
          >
            {isLocked ? (
              <Lock size={11} className="text-amber-400" />
            ) : (
              <Unlock size={11} />
            )}
          </button>
        </div>
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
  const elements = useEditorStore((s) => s.elements);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);

  const rootElements = React.useMemo(
    () =>
      Object.values(elements)
        .filter((el) => !el.parentId)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
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
