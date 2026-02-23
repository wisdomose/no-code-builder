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
  onLayoutChange,
}: {
  element: EditorElement;
  isExpanded: boolean;
  onToggle: () => void;
  onLayoutChange: (key: string, value: any) => void;
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
          value={element.layout.x ?? ""}
          onChange={(v) => onLayoutChange("x", v)}
        />
        <Control
          label="Y"
          value={element.layout.y ?? ""}
          onChange={(v) => onLayoutChange("y", v)}
        />
        <Control
          label="W"
          value={element.layout.width}
          onChange={(v) => onLayoutChange("width", v)}
          onToggleAuto={() => {
            if (element.layout.width === "auto") {
              const node = getElementRef(element.id);
              onLayoutChange("width", node ? node.offsetWidth : 100);
            } else {
              onLayoutChange("width", "auto");
            }
          }}
          min={1}
        />
        <Control
          label="H"
          value={element.layout.height}
          onChange={(v) => onLayoutChange("height", v)}
          onToggleAuto={() => {
            if (element.layout.height === "auto") {
              const node = getElementRef(element.id);
              onLayoutChange("height", node ? node.offsetHeight : 100);
            } else {
              onLayoutChange("height", "auto");
            }
          }}
          min={1}
        />
      </div>
    </Section>
  );
}
