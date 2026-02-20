/**
 * Size & Position panel — shows X, Y, W, H inputs for any element.
 */
import { Move } from "lucide-react";
import { Section, Control } from "./controls";
import type { EditorElement } from "@/lib/useEditorStore";
import { getElementRef } from "@/lib/useEditorStore";

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
          onToggleAuto={() => {
            if (element.props.width === "auto") {
              const node = getElementRef(element.id);
              onPropChange("width", node ? node.offsetWidth : 100);
            } else {
              onPropChange("width", "auto");
            }
          }}
          min={1}
        />
        <Control
          label="H"
          value={element.props.height}
          onChange={(v) => onPropChange("height", v)}
          onToggleAuto={() => {
            if (element.props.height === "auto") {
              const node = getElementRef(element.id);
              onPropChange("height", node ? node.offsetHeight : 100);
            } else {
              onPropChange("height", "auto");
            }
          }}
          min={1}
        />
      </div>
    </Section>
  );
}
