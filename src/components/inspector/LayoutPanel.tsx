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
  onPropChange,
}: {
  element: EditorElement;
  isExpanded: boolean;
  onToggle: () => void;
  onPropChange: (key: string, value: any) => void;
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
                        element.props.gridTemplateColumns || "1fr 1fr",
                      gridTemplateRows:
                        element.props.gridTemplateRows || "auto",
                    });
                  } else {
                    onPropChange("display", mode);
                  }
                }}
                className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                  element.props.display === mode
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
        {element.props.display === "grid" && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <GridCounter
                label="Cols"
                value={element.props.gridTemplateColumns || "1fr 1fr"}
                onChange={(v) => onPropChange("gridTemplateColumns", v)}
              />
              <GridCounter
                label="Rows"
                value={element.props.gridTemplateRows || "auto"}
                onChange={(v) => onPropChange("gridTemplateRows", v)}
                isRow
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Control
                label="Gap"
                value={element.props.gap || 0}
                onChange={(v) => onPropChange("gap", v)}
              />
              <Control
                label="Padding"
                value={Number(element.props.padding) || 0}
                onChange={(v) => onPropChange("padding", v)}
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
                    onClick={() => onPropChange("justifyContent", item.val)}
                    className={`flex-1 flex items-center justify-center py-1 rounded transition-all ${
                      element.props.justifyContent === item.val
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
        {element.props.display === "flex" && (
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
                    onClick={() => onPropChange("flexDirection", dir)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                      element.props.flexDirection === dir
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
                value={element.props.gap || 0}
                onChange={(v) => onPropChange("gap", v)}
              />
              <Control
                label="Padding"
                value={Number(element.props.padding) || 0}
                onChange={(v) => onPropChange("padding", v)}
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
                    onClick={() => onPropChange("flexWrap", w)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                      (element.props.flexWrap || "nowrap") === w
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
              alignItems={element.props.alignItems || "start"}
              justifyContent={element.props.justifyContent || "start"}
              flexDirection={element.props.flexDirection || "row"}
              onAlignChange={(v) => onPropChange("alignItems", v)}
              onJustifyChange={(v) => onPropChange("justifyContent", v)}
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
                    onClick={() => onPropChange("justifyContent", item.val)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${
                      element.props.justifyContent === item.val
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
        {(!element.props.display || element.props.display === "block") && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <Control
                label="Padding"
                value={Number(element.props.padding) || 0}
                onChange={(v) => onPropChange("padding", v)}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                  Overflow
                </span>
                <CustomSelect
                  value={element.props.overflow || "visible"}
                  options={[
                    { value: "visible", label: "Visible" },
                    { value: "hidden", label: "Hidden" },
                    { value: "scroll", label: "Scroll" },
                    { value: "auto", label: "Auto" },
                  ]}
                  onChange={(v) => onPropChange("overflow", v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Overflow — always visible for flex/grid too */}
        {(element.props.display === "flex" ||
          element.props.display === "grid") && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                Overflow
              </span>
              <CustomSelect
                value={element.props.overflow || "visible"}
                options={[
                  { value: "visible", label: "Visible" },
                  { value: "hidden", label: "Hidden" },
                  { value: "scroll", label: "Scroll" },
                  { value: "auto", label: "Auto" },
                ]}
                onChange={(v) => onPropChange("overflow", v)}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
