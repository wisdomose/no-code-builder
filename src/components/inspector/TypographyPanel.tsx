/**
 * Typography panel — font family, size, weight, and text alignment.
 */
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { Section, IconButton } from "./controls";
import type { EditorElement } from "@/lib/useEditorStore";
import { Control } from "./controls";

export function TypographyPanel({
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
  return (
    <Section
      title="Typography"
      icon={<Type size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
            Font Family
          </label>
          <select className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-[12px] text-text-main focus:border-primary outline-none transition-all">
            <option>Inter</option>
            <option>JetBrains Mono</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Control
            label="Size"
            value={element.props.fontSize || 16}
            onChange={(v) => onPropChange("fontSize", v)}
          />
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
              Weight
            </span>
            <select
              value={element.props.fontWeight || 400}
              onChange={(e) => onPropChange("fontWeight", e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 text-[11px] font-bold text-text-main focus:border-primary outline-none transition-all cursor-pointer"
            >
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
              <option value="800">Black</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between p-0.5 bg-background border border-border rounded-lg">
          <IconButton
            icon={<AlignLeft size={14} />}
            active={
              element.props.textAlign === "left" || !element.props.textAlign
            }
            onClick={() => onPropChange("textAlign", "left")}
          />
          <IconButton
            icon={<AlignCenter size={14} />}
            active={element.props.textAlign === "center"}
            onClick={() => onPropChange("textAlign", "center")}
          />
          <IconButton
            icon={<AlignRight size={14} />}
            active={element.props.textAlign === "right"}
            onClick={() => onPropChange("textAlign", "right")}
          />
          <IconButton
            icon={<AlignJustify size={14} />}
            active={element.props.textAlign === "justify"}
            onClick={() => onPropChange("textAlign", "justify")}
          />
        </div>
      </div>
    </Section>
  );
}
