/**
 * PropertyInspector — thin orchestrator composing all inspector panels.
 */
import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import { Type, Maximize2, Lock, EyeOff } from "lucide-react";
import { SizePositionPanel } from "./inspector/SizePositionPanel";
import { TypographyPanel } from "./inspector/TypographyPanel";
import { FillStrokePanel } from "./inspector/FillStrokePanel";
import { LayoutPanel } from "./inspector/LayoutPanel";
import { EffectsPanel } from "./inspector/EffectsPanel";
import { ImagePanel } from "./inspector/ImagePanel";

export const PropertyInspector: React.FC = () => {
  const element = useEditorStore((s) =>
    s.selectedId ? (s.elements[s.selectedId] ?? null) : null,
  );
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateElementMeta = useEditorStore((s) => s.updateElementMeta);

  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "Size & Position",
    "Typography",
    "Fill & Stroke",
    "Layout",
    "Image",
    "Effects",
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

  const handlePropChange = (key: string, value: unknown) => {
    updateElement(element.id, { [key]: value });
  };

  const toggle = (title: string) =>
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
    );

  const isContainer = element.type === "container" || element.type === "div";
  const isText = element.type === "text";
  const isImage = element.type === "image";

  return (
    <div className="flex-1 overflow-y-auto space-y-px bg-border/20">
      {/* Selection Summary + name edit */}
      <div className="p-4 bg-surface border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
            {isText ? <Type size={14} /> : <Maximize2 size={14} />}
          </span>
          <input
            type="text"
            value={element.name || ""}
            onChange={(e) =>
              updateElementMeta(element.id, { name: e.target.value })
            }
            placeholder={element.id}
            className="flex-1 min-w-0 bg-transparent text-[13px] font-bold text-text-main outline-none placeholder:text-text-muted/50 focus:border-b focus:border-primary pb-0.5 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
            {element.type} Layer
          </p>
          <div className="flex items-center gap-1.5">
            {element.visible === false && (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-text-muted px-1.5 py-0.5 rounded bg-background border border-border">
                <EyeOff size={10} /> Hidden
              </span>
            )}
            {element.locked && (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-amber-400 px-1.5 py-0.5 rounded bg-background border border-border">
                <Lock size={10} /> Locked
              </span>
            )}
          </div>
        </div>
      </div>

      <SizePositionPanel
        element={element}
        isExpanded={expandedSections.includes("Size & Position")}
        onToggle={() => toggle("Size & Position")}
        onPropChange={handlePropChange}
      />

      {isText && (
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

      {isImage && (
        <ImagePanel
          element={element}
          isExpanded={expandedSections.includes("Image")}
          onToggle={() => toggle("Image")}
          onPropChange={handlePropChange}
        />
      )}

      <FillStrokePanel
        element={element}
        isExpanded={expandedSections.includes("Fill & Stroke")}
        onToggle={() => toggle("Fill & Stroke")}
        onPropChange={handlePropChange}
      />

      <EffectsPanel
        element={element}
        isExpanded={expandedSections.includes("Effects")}
        onToggle={() => toggle("Effects")}
        onPropChange={handlePropChange}
      />
    </div>
  );
};
