/**
 * PropertyInspector — thin orchestrator that composes the inspector panels.
 * All heavy lifting lives in ./inspector/ sub-components.
 */
import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import { Type, Maximize2 } from "lucide-react";
import { SizePositionPanel } from "./inspector/SizePositionPanel";
import { TypographyPanel } from "./inspector/TypographyPanel";
import { FillStrokePanel } from "./inspector/FillStrokePanel";
import { LayoutPanel } from "./inspector/LayoutPanel";

export const PropertyInspector: React.FC = () => {
  const { selectedId, elements, updateElement } = useEditorStore();
  const element = selectedId ? elements[selectedId] : null;
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "Size & Position",
    "Typography",
    "Fill & Stroke",
    "Layout",
  ]);

  if (!element) {
    return (
      <div className="p-12 text-center space-y-3 opacity-30 select-none h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
          <Maximize2 size={20} />
        </div>
        <p className="text-[11px] font-medium tracking-wide uppercase">
          Select an element
        </p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateElement(element.id, { [key]: value });
  };

  const toggle = (title: string) =>
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
    );

  const isContainer = element.type === "container" || element.type === "div";

  return (
    <div className="flex-1 overflow-y-auto space-y-px bg-border/20">
      {/* Selection Summary */}
      <div className="p-4 bg-surface border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded bg-primary/10 text-primary">
            {element.type === "text" ? (
              <Type size={14} />
            ) : (
              <Maximize2 size={14} />
            )}
          </span>
          <span className="text-[13px] font-bold text-text-main">
            {element.id}
          </span>
        </div>
        <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
          {element.type} Layer
        </p>
      </div>

      <SizePositionPanel
        element={element}
        isExpanded={expandedSections.includes("Size & Position")}
        onToggle={() => toggle("Size & Position")}
        onPropChange={handlePropChange}
      />

      {element.type === "text" && (
        <TypographyPanel
          element={element}
          isExpanded={expandedSections.includes("Typography")}
          onToggle={() => toggle("Typography")}
          onPropChange={handlePropChange}
        />
      )}

      {isContainer && (
        <LayoutPanel
          element={element}
          isExpanded={expandedSections.includes("Layout")}
          onToggle={() => toggle("Layout")}
          onPropChange={handlePropChange}
        />
      )}

      <FillStrokePanel
        element={element}
        isExpanded={expandedSections.includes("Fill & Stroke")}
        onToggle={() => toggle("Fill & Stroke")}
        onPropChange={handlePropChange}
      />
    </div>
  );
};
