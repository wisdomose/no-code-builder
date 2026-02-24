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
  expandedIds,
  toggleExpand,
  onDragStart,
  onDragOver,
  onDrop,
  dragOverId,
  dragPosition,
  isDragging,
}: {
  el: EditorElement;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  elements: Record<string, EditorElement>;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  dragOverId: string | null;
  dragPosition: "before" | "inside" | "after" | null;
  isDragging: boolean;
}) {
  const updateElementMeta = useEditorStore((s) => s.updateElementMeta);

  const isSelected = selectedId === el.id;
  const isVisible = el.visible !== false;
  const isLocked = el.locked === true;
  const displayName = el.name || el.id;

  const children = (el.children || [])
    .map((id) => elements[id])
    .filter(Boolean);

  return (
    <div>
      <div
        draggable={true}
        onDragStart={(e) => onDragStart(e, el.id)}
        onDragEnd={() => {
          onDragOver(null as any, ""); // clear state
        }}
        onDragOver={(e) => onDragOver(e, el.id)}
        onDrop={(e) => {
          e.stopPropagation();
          onDrop(e, el.id);
        }}
        onClick={() => {
          if (!isLocked) onSelect(el.id);
        }}
        className={`
          flex items-center gap-2 py-1.5 cursor-pointer group select-none pr-2 relative
          ${isSelected && !isDragging ? "bg-primary/20 border-l-2 border-primary" : "hover:bg-background/50 border-l-2 border-transparent"}
          ${!isVisible ? "opacity-40" : ""}
          ${dragOverId === el.id && dragPosition === "inside" ? "bg-primary/5 ring-1 ring-inset ring-primary/40" : ""}
          transition-all duration-75
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {/* Drop Indicators */}
        {dragOverId === el.id && dragPosition === "before" && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-50 pointer-events-none" />
        )}
        {dragOverId === el.id && dragPosition === "after" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-50 pointer-events-none" />
        )}
        {children.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(el.id);
            }}
            className="p-0.5 hover:bg-white/10 rounded-sm transition-colors shrink-0"
          >
            <ChevronRight
              size={12}
              className={`text-text-muted transition-transform duration-200 ${expandedIds.has(el.id) ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <div className="w-4 shrink-0" />
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

      {expandedIds.has(el.id) &&
        el.children?.map((childId) => {
          const childEl = elements[childId];
          return childEl ? (
            <LayerItem
              key={childId}
              el={childEl}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              elements={elements}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              dragOverId={dragOverId}
              dragPosition={dragPosition}
              isDragging={isDragging}
            />
          ) : null;
        })}
    </div>
  );
}

export const LayerTree: React.FC = () => {
  const elements = useEditorStore((s) => s.elements);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const reorderElement = useEditorStore((s) => s.reorderElement);
  const rootElementsIds = useEditorStore((s) => s.rootElements);

  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    new Set(Object.keys(elements)),
  );
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  const [dragPosition, setDragPosition] = React.useState<
    "before" | "inside" | "after" | null
  >(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const draggedIdRef = React.useRef<string | null>(null);

  const toggleExpand = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggedIdRef.current = id;
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id?: string) => {
    if (!e) {
      // Manual clear from onDragEnd
      setDragOverId(null);
      setDragPosition(null);
      draggedIdRef.current = null;
      setIsDragging(false);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (
      !id ||
      id === draggedIdRef.current ||
      (draggedIdRef.current && isDescendant(draggedIdRef.current, id))
    ) {
      setDragOverId(null);
      setDragPosition(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;

    const targetEl = elements[id];
    const isContainer =
      targetEl?.type === "container" || targetEl?.type === "div";

    // Threshold for edge drops (top/bottom)
    const threshold = 6;

    if (y < threshold) {
      setDragPosition("before");
    } else if (y > h - threshold) {
      setDragPosition("after");
    } else if (isContainer) {
      setDragPosition("inside");
    } else {
      // For non-containers, split the middle
      if (y < h / 2) setDragPosition("before");
      else setDragPosition("after");
    }

    setDragOverId(id);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Check if we actually left the whole container
    const relatedTarget = e.relatedTarget as Node | null;
    const container = e.currentTarget as Node;
    if (relatedTarget && container.contains(relatedTarget)) return;

    setDragOverId(null);
    setDragPosition(null);
  };

  const isDescendant = (parentId: string, elementId: string): boolean => {
    const parent = elements[parentId];
    if (!parent?.children) return false;
    if (parent.children.includes(elementId)) return true;
    return parent.children.some((childId) => isDescendant(childId, elementId));
  };

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    const draggedId =
      e.dataTransfer.getData("text/plain") || draggedIdRef.current;

    const finalTargetId = targetId || dragOverId;
    const finalDragPosition = dragPosition;

    setDragOverId(null);
    setDragPosition(null);
    draggedIdRef.current = null;
    setIsDragging(false);

    if (!draggedId || draggedId === finalTargetId) return;

    // Safety check: Prevent dropping into your own descendants
    if (finalTargetId && isDescendant(draggedId, finalTargetId)) {
      return;
    }

    let newParentId: string | undefined = undefined;
    let newIndex = 0;

    if (finalTargetId) {
      const targetEl = elements[finalTargetId];
      if (finalDragPosition === "inside") {
        newParentId = finalTargetId;
        newIndex = targetEl.children?.length || 0;
      } else {
        newParentId = targetEl.parentId;

        // Use children array as truth for siblings
        const siblingIds = newParentId
          ? elements[newParentId]?.children || []
          : rootElementsIds;

        // Exclude dragged item to calculate stable target index
        const cleanSiblings = siblingIds.filter((id) => id !== draggedId);
        const targetIndex = cleanSiblings.indexOf(finalTargetId);

        newIndex =
          finalDragPosition === "before" ? targetIndex : targetIndex + 1;
      }
    } else {
      // Root drop fallback — insert at end
      newParentId = undefined;
      newIndex = rootElementsIds.filter((id) => id !== draggedId).length;
    }

    reorderElement(draggedId, newParentId, Math.max(0, newIndex));
  };

  const rootElements = React.useMemo(
    () =>
      rootElementsIds
        .map((id) => elements[id])
        .filter(Boolean) as EditorElement[],
    [elements, rootElementsIds],
  );

  return (
    <div
      className="flex-1 overflow-auto no-scrollbar"
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
    >
      {rootElements.map((el) => (
        <LayerItem
          key={el.id}
          el={el}
          depth={0}
          selectedId={selectedId}
          onSelect={setSelectedId}
          elements={elements}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          dragOverId={dragOverId}
          dragPosition={dragPosition}
          isDragging={isDragging}
        />
      ))}
    </div>
  );
};
