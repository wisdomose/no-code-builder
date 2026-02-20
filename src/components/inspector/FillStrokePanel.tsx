/**
 * Fill & Stroke panel — background/color picker, border radius, z-index.
 */
import { Palette } from "lucide-react";
import { Section, Control } from "./controls";
import { ColorPicker } from "../ColorPicker";
import type { EditorElement } from "@/lib/useEditorStore";

export function FillStrokePanel({
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
      title="Fill & Stroke"
      icon={<Palette size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <ColorPicker
        color={
          (element.type === "text"
            ? element.props.color
            : element.props.background) || "#ffffff"
        }
        onChange={(newColor) =>
          onPropChange(
            element.type === "text" ? "color" : "background",
            newColor,
          )
        }
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Control
          label="Radius"
          value={element.props.borderRadius || 0}
          onChange={(v) => onPropChange("borderRadius", v)}
        />
        <Control
          label="Z Index"
          value={element.props.zIndex || 1}
          onChange={(v) => onPropChange("zIndex", v)}
        />
      </div>
    </Section>
  );
}
