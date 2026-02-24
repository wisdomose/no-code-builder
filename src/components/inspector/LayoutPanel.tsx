/**
 * Layout panel — display mode (block/flex/grid), flex direction,
 * grid columns/rows, gap, padding, alignment matrix, and justify controls.
 */
import {
  LayoutGrid,
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
  AlignHorizontalDistributeCenter,
  StretchHorizontal,
} from "lucide-react";
import {
  Section,
  Control,
  GridCounter,
  AlignmentMatrix,
  CustomSelect,
} from "./controls";
import type { EditorElement } from "@/lib/useEditorStore";
import { useEditorStore } from "@/lib/useEditorStore";

export function LayoutPanel({
  element,
  isExpanded,
  onToggle,
  onLayoutChange,
}: {
  element: EditorElement;
  isExpanded: boolean;
  onToggle: () => void;
  onLayoutChange: (key: string, value: any) => void;
}) {
  const updateElement = useEditorStore((s) => s.updateElement);

  return (
    <Section
      title="Layout"
      icon={<LayoutGrid size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {/* Display Mode Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            Display
          </span>
          <div className="flex bg-background/50 rounded p-1 border border-border">
            {["block", "flex", "grid"].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  if (mode === "grid") {
                    updateElement(element.id, {
                      display: "grid",
                      gridTemplateColumns:
                        element.layout.gridTemplateColumns || "1fr 1fr",
                      gridTemplateRows:
                        element.layout.gridTemplateRows || "auto",
                    });
                  } else {
                    onLayoutChange("display", mode);
                  }
                }}
                className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                  element.layout.display === mode
                    ? "bg-surface text-primary shadow-sm"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Controls */}
        {element.layout.display === "grid" && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <GridCounter
                label="Cols"
                value={element.layout.gridTemplateColumns || "1fr 1fr"}
                onChange={(v) => onLayoutChange("gridTemplateColumns", v)}
              />
              <GridCounter
                label="Rows"
                value={element.layout.gridTemplateRows || "auto"}
                onChange={(v) => onLayoutChange("gridTemplateRows", v)}
                isRow
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Control
                label="Gap"
                value={element.layout.gap || 0}
                onChange={(v) => onLayoutChange("gap", v)}
              />
              <Control
                label="Padding"
                value={Number(element.layout.padding) || 0}
                onChange={(v) => onLayoutChange("padding", v)}
              />
            </div>
            {/* Grid Justify */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Justify
              </span>
              <div className="flex bg-background/50 rounded p-1 border border-border">
                {[
                  { val: "stretch", icon: <StretchHorizontal size={14} /> },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => onLayoutChange("justifyContent", item.val)}
                    className={`flex-1 flex items-center justify-center py-1 rounded transition-all ${
                      element.layout.justifyContent === item.val
                        ? "bg-surface text-primary shadow-sm"
                        : "text-text-muted hover:text-text-main"
                    }`}
                    title={item.val}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flex Controls */}
        {element.layout.display === "flex" && (
          <div className="space-y-3 pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-1">
            {/* Flex Direction */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Direction
              </span>
              <div className="flex bg-background/50 rounded p-1 border border-border">
                {["row", "column"].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => onLayoutChange("flexDirection", dir)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                      element.layout.flexDirection === dir
                        ? "bg-surface text-primary shadow-sm"
                        : "text-text-muted hover:text-text-main"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">
                      {dir}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Control
                label="Gap"
                value={element.layout.gap || 0}
                onChange={(v) => onLayoutChange("gap", v)}
              />
              <Control
                label="Padding"
                value={Number(element.layout.padding) || 0}
                onChange={(v) => onLayoutChange("padding", v)}
              />
            </div>

            {/* Flex Wrap */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Wrap
              </span>
              <div className="flex bg-background/50 rounded p-1 border border-border">
                {["nowrap", "wrap"].map((w) => (
                  <button
                    key={w}
                    onClick={() => onLayoutChange("flexWrap", w)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                      (element.layout.flexWrap || "nowrap") === w
                        ? "bg-surface text-primary shadow-sm"
                        : "text-text-muted hover:text-text-main"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{w}</span>
                  </button>
                ))}
              </div>
            </div>

            <AlignmentMatrix
              alignItems={element.layout.alignItems || "start"}
              justifyContent={element.layout.justifyContent || "start"}
              flexDirection={element.layout.flexDirection || "row"}
              onAlignChange={(v) => onLayoutChange("alignItems", v)}
              onJustifyChange={(v) => onLayoutChange("justifyContent", v)}
            />

            {/* Space distribution controls */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Justify
              </span>
              <div className="flex bg-background/50 rounded p-1 border border-border">
                {[
                  {
                    val: "space-between",
                    icon: <AlignHorizontalSpaceBetween size={14} />,
                  },
                  {
                    val: "space-around",
                    icon: <AlignHorizontalSpaceAround size={14} />,
                  },
                  {
                    val: "space-evenly",
                    icon: <AlignHorizontalDistributeCenter size={14} />,
                  },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => onLayoutChange("justifyContent", item.val)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                      element.layout.justifyContent === item.val
                        ? "bg-surface text-primary shadow-sm"
                        : "text-text-muted hover:text-text-main"
                    }`}
                    title={item.val}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Block Controls */}
        {(!element.layout.display || element.layout.display === "block") && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <Control
                label="Padding"
                value={Number(element.layout.padding) || 0}
                onChange={(v) => onLayoutChange("padding", v)}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                  Overflow
                </span>
                <CustomSelect
                  value={element.layout.overflow || "visible"}
                  options={[
                    { value: "visible", label: "Visible" },
                    { value: "hidden", label: "Hidden" },
                    { value: "scroll", label: "Scroll" },
                    { value: "auto", label: "Auto" },
                  ]}
                  onChange={(v) => onLayoutChange("overflow", v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Overflow — always visible for flex/grid too */}
        {(element.layout.display === "flex" ||
          element.layout.display === "grid") && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                Overflow
              </span>
              <CustomSelect
                value={element.layout.overflow || "visible"}
                options={[
                  { value: "visible", label: "Visible" },
                  { value: "hidden", label: "Hidden" },
                  { value: "scroll", label: "Scroll" },
                  { value: "auto", label: "Auto" },
                ]}
                onChange={(v) => onLayoutChange("overflow", v)}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
