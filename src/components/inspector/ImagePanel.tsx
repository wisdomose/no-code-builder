/**
 * Image panel — source URL, object-fit, and alt text for image elements.
 */
import { ImageIcon } from "lucide-react";
import { Section } from "./controls";
import type { EditorElement } from "@/lib/useEditorStore";

export function ImagePanel({
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
      title="Image"
      icon={<ImageIcon size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {/* Preview */}
        {element.props.src && (
          <div className="w-full h-20 rounded-lg overflow-hidden border border-border/50 bg-background/50">
            <img
              src={element.props.src}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Source URL */}
        <div>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
            Source URL
          </span>
          <input
            type="text"
            value={element.props.src || ""}
            onChange={(e) => onPropChange("src", e.target.value)}
            placeholder="https://..."
            className="w-full bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 text-[11px] font-mono text-text-main focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Alt text (stored as name) */}
        <div>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
            Alt Text
          </span>
          <input
            type="text"
            value={element.name || ""}
            onChange={(e) =>
              // Alt text doubles as the element name
              useEditorStore.setState((s) => ({
                elements: {
                  ...s.elements,
                  [element.id]: {
                    ...s.elements[element.id],
                    name: e.target.value,
                  },
                },
              }))
            }
            placeholder="Describe the image..."
            className="w-full bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 text-[11px] text-text-main focus:border-primary outline-none transition-all"
          />
        </div>
      </div>
    </Section>
  );
}

import { useEditorStore } from "@/lib/useEditorStore";
