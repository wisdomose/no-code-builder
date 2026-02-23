/**
 * Fill & Stroke panel — background, border controls, corner radius, z-index.
 */
import { Palette } from "lucide-react";
import { Section, Control, CustomSelect } from "./controls";
import { ColorPicker } from "../ColorPicker";
import type { EditorElement } from "@/lib/useEditorStore";

const BORDER_STYLE_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    preview: <div className="w-8 h-0 border-t-2 border-text-muted" />,
  },
  {
    value: "dashed",
    label: "Dashed",
    preview: (
      <div className="w-8 h-0 border-t-2 border-dashed border-text-muted" />
    ),
  },
  {
    value: "dotted",
    label: "Dotted",
    preview: (
      <div className="w-8 h-0 border-t-2 border-dotted border-text-muted" />
    ),
  },
  {
    value: "double",
    label: "Double",
    preview: (
      <div className="w-8 h-0 border-t-4 border-double border-text-muted" />
    ),
  },
  {
    value: "none",
    label: "None",
    preview: <div className="w-8 h-px bg-text-muted/20" />,
  },
] as const;

export function FillStrokePanel({
  element,
  isExpanded,
  onToggle,
  onStyleChange,
  onLayoutChange,
}: {
  element: EditorElement;
  isExpanded: boolean;
  onToggle: () => void;
  onStyleChange: (key: string, value: any) => void;
  onLayoutChange: (key: string, value: any) => void;
}) {
  return (
    <Section
      title="Fill & Stroke"
      icon={<Palette size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {/* Fill color */}
        <div>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
            {element.type === "text" ? "Color" : "Background"}
          </span>
          <ColorPicker
            color={
              (element.type === "text"
                ? element.style.color
                : element.style.background) || "#ffffff"
            }
            onChange={(newColor) =>
              onStyleChange(
                element.type === "text" ? "color" : "background",
                newColor,
              )
            }
          />
        </div>

        {/* Corner radius + Z Index */}
        <div className="grid grid-cols-2 gap-3">
          <Control
            label="Radius"
            value={element.style.borderRadius || 0}
            onChange={(v) => onStyleChange("borderRadius", v)}
            min={0}
          />
          <Control
            label="Z Index"
            value={element.layout.zIndex || 1}
            onChange={(v) => onLayoutChange("zIndex", v)}
            min={0}
          />
        </div>

        {/* Border */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            Border
          </span>

          <div className="grid grid-cols-2 gap-3">
            <Control
              label="Width"
              value={element.style.borderWidth || 0}
              onChange={(v) => onStyleChange("borderWidth", v)}
              min={0}
            />
            <CustomSelect
              label="Style"
              value={element.style.borderStyle || "solid"}
              options={BORDER_STYLE_OPTIONS as any}
              onChange={(v) => onStyleChange("borderStyle", v)}
            />
          </div>

          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
              Border Color
            </span>
            <ColorPicker
              color={element.style.borderColor || "#000000"}
              onChange={(c) => onStyleChange("borderColor", c)}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
