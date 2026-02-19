import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import {
  Type,
  Maximize2,
  Move,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LayoutGrid,
} from "lucide-react";

import { ColorPicker } from "./ColorPicker";

export const PropertyInspector: React.FC = () => {
  const { selectedId, elements, updateElement } = useEditorStore();
  const element = elements.find((el) => el.id === selectedId);
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "Size & Position",
    "Typography",
    "Fill & Stroke",
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

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
    );
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar space-y-px bg-border/20">
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

      {/* Geometry Section */}
      <Section
        title="Size & Position"
        icon={<Move size={12} />}
        isExpanded={expandedSections.includes("Size & Position")}
        onToggle={() => toggleSection("Size & Position")}
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <Control
            label="X"
            value={element.props.x}
            onChange={(v) => handlePropChange("x", v)}
          />
          <Control
            label="Y"
            value={element.props.y}
            onChange={(v) => handlePropChange("y", v)}
          />
          <Control
            label="W"
            value={element.props.width}
            onChange={(v) => handlePropChange("width", v)}
          />
          <Control
            label="H"
            value={element.props.height}
            onChange={(v) => handlePropChange("height", v)}
          />
        </div>
      </Section>

      {/* Text Properties */}
      {element.type === "text" && (
        <Section
          title="Typography"
          icon={<Type size={12} />}
          isExpanded={expandedSections.includes("Typography")}
          onToggle={() => toggleSection("Typography")}
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
                onChange={(v) => handlePropChange("fontSize", v)}
              />
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                  Weight
                </span>
                <select
                  value={element.props.fontWeight || 400}
                  onChange={(e) =>
                    handlePropChange("fontWeight", e.target.value)
                  }
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
                onClick={() => handlePropChange("textAlign", "left")}
              />
              <IconButton
                icon={<AlignCenter size={14} />}
                active={element.props.textAlign === "center"}
                onClick={() => handlePropChange("textAlign", "center")}
              />
              <IconButton
                icon={<AlignRight size={14} />}
                active={element.props.textAlign === "right"}
                onClick={() => handlePropChange("textAlign", "right")}
              />
              <IconButton
                icon={<AlignJustify size={14} />}
                active={element.props.textAlign === "justify"}
                onClick={() => handlePropChange("textAlign", "justify")}
              />
            </div>
          </div>
        </Section>
      )}

      {/* Layout Section */}
      {(element.type === "container" || element.type === "div") && (
        <Section
          title="Auto Layout"
          icon={<LayoutGrid size={12} />}
          isExpanded={expandedSections.includes("Layout")}
          onToggle={() => toggleSection("Layout")}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Direction
              </span>
              <div className="flex bg-background/50 rounded p-1 border border-border">
                {["row", "column"].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => handlePropChange("flexDirection", dir)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${element.props.flexDirection === dir ? "bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text-main"}`}
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
                onChange={(v) => handlePropChange("gap", v)}
              />
              <Control
                label="Padding"
                value={Number(element.props.padding) || 0}
                onChange={(v) => handlePropChange("padding", v)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Align
              </span>
              <div className="flex bg-background/50 rounded p-1 border border-border">
                {["start", "center", "end", "stretch"].map((align) => (
                  <button
                    key={align}
                    onClick={() => handlePropChange("alignItems", align)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded transition-all ${element.props.alignItems === align ? "bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text-main"}`}
                  >
                    <span className="text-[9px] font-bold uppercase">
                      {align.slice(0, 1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Style Section */}
      <Section
        title="Fill & Stroke"
        icon={<Palette size={12} />}
        isExpanded={expandedSections.includes("Fill & Stroke")}
        onToggle={() => toggleSection("Fill & Stroke")}
      >
        <ColorPicker
          color={
            (element.type === "text"
              ? element.props.color
              : element.props.background) || "#ffffff"
          }
          onChange={(newColor) =>
            handlePropChange(
              element.type === "text" ? "color" : "background",
              newColor,
            )
          }
        />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Control
            label="Radius"
            value={element.props.borderRadius || 0}
            onChange={(v) => handlePropChange("borderRadius", v)}
          />
          <Control
            label="Z Index"
            value={element.props.zIndex || 1}
            onChange={(v) => handlePropChange("zIndex", v)}
          />
        </div>
      </Section>
    </div>
  );
};

// --- Internal Sub-Components ---

function Section({
  title,
  children,
  icon,
  isExpanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-surface border-b border-border shadow-sm">
      <div
        onClick={onToggle}
        className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-background/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-text-muted group-hover:text-text-main transition-colors">
            {icon}
          </span>
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider group-hover:text-text-main transition-all">
            {title}
          </span>
        </div>
        <ChevronDown
          size={12}
          className={`text-text-muted group-hover:text-text-main transition-all transform ${
            isExpanded ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>
      {isExpanded && (
        <div className="px-4 pb-5 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function Control({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: any;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  const handleWheel = (e: React.WheelEvent) => {
    if (readOnly || !onChange) return;
    const delta = e.deltaY < 0 ? 1 : -1;
    onChange(Number(value) + delta);
  };

  return (
    <div className="flex items-center gap-2 bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 focus-within:border-primary focus-within:ring-0 transition-all group relative">
      <span className="text-[10px] font-bold text-text-muted tracking-tight w-4 group-hover:text-text-main shrink-0">
        {label}
      </span>
      <input
        type={typeof value === "number" ? "number" : "text"}
        value={value}
        readOnly={readOnly}
        onWheel={handleWheel}
        onChange={(e) => {
          const val = e.target.value;
          if (typeof value === "number") {
            onChange?.(val === "" ? 0 : Number(val));
          }
        }}
        className={`
          w-full bg-transparent border-none p-0 text-[12px] font-mono font-bold text-text-main focus:ring-0 outline-none text-right
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          ${readOnly ? "cursor-default opacity-50" : "cursor-ns-resize"}
        `}
      />
    </div>
  );
}

function IconButton({
  icon,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
      flex-1 flex justify-center py-2.5 rounded-md transition-all
      ${active ? "bg-surface shadow-md text-primary" : "text-text-muted hover:bg-surface hover:text-text-main"}
    `}
    >
      {icon}
    </button>
  );
}

function ChevronDown({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
