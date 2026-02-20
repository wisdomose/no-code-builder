/**
 * Size & Position panel — shows X, Y, W, H inputs for any element.
 */
import { Move } from "lucide-react";
import { Section, Control } from "./controls";
import type { EditorElement } from "@/lib/useEditorStore";

export function SizePositionPanel({
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
      title="Size & Position"
      icon={<Move size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        <Control
          label="X"
          value={element.props.x}
          onChange={(v) => onPropChange("x", v)}
        />
        <Control
          label="Y"
          value={element.props.y}
          onChange={(v) => onPropChange("y", v)}
        />
        <Control
          label="W"
          value={element.props.width}
          onChange={(v) => onPropChange("width", v)}
        />
        <Control
          label="H"
          value={element.props.height}
          onChange={(v) => onPropChange("height", v)}
        />
      </div>
    </Section>
  );
}
