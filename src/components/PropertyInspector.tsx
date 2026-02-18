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
} from "lucide-react";

export const PropertyInspector: React.FC = () => {
  const { selectedId, elements, updateElement } = useEditorStore();
  const element = elements.find((el) => el.id === selectedId);

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
      <Section title="Size & Position" icon={<Move size={12} />}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <Control
            label="X"
            value={element.props.x}
            onChange={(v) => handlePropChange("x", parseInt(v))}
          />
          <Control
            label="Y"
            value={element.props.y}
            onChange={(v) => handlePropChange("y", parseInt(v))}
          />
          <Control
            label="W"
            value={element.props.width}
            onChange={(v) => handlePropChange("width", parseInt(v))}
          />
          <Control
            label="H"
            value={element.props.height}
            onChange={(v) => handlePropChange("height", parseInt(v))}
          />
        </div>
      </Section>

      {/* Text Properties */}
      {element.type === "text" && (
        <Section title="Typography" icon={<Type size={12} />}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
                Font Family
              </label>
              <select className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-[12px] text-text-main focus:ring-1 focus:ring-primary outline-none transition-all">
                <option>Inter</option>
                <option>JetBrains Mono</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Control
                label="Size"
                value={element.props.fontSize || 16}
                onChange={(v) => handlePropChange("fontSize", parseInt(v))}
              />
              <Control label="Weight" value="Regular" />
            </div>
            <div className="flex items-center justify-between p-0.5 bg-background border border-border rounded-lg">
              <IconButton icon={<AlignLeft size={14} />} active />
              <IconButton icon={<AlignCenter size={14} />} />
              <IconButton icon={<AlignRight size={14} />} />
              <IconButton icon={<AlignJustify size={14} />} />
            </div>
          </div>
        </Section>
      )}

      {/* Style Section */}
      <Section title="Fill & Stroke" icon={<Palette size={12} />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-2 flex-1">
              <div
                className="w-10 h-10 rounded-lg border border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
                style={{ background: element.props.background || "#ffffff" }}
              />
              <div className="flex flex-col">
                <input
                  type="text"
                  value={element.props.background || "#000000"}
                  onChange={(e) =>
                    handlePropChange("background", e.target.value)
                  }
                  className="bg-transparent border-none p-0 text-[12px] font-mono font-bold text-text-main focus:ring-0 uppercase"
                />
                <span className="text-[10px] text-text-muted font-bold uppercase">
                  Background Color
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-text-muted group-hover:text-text-main">
              100%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Control
              label="Radius"
              value={element.props.borderRadius || 0}
              onChange={(v) => handlePropChange("borderRadius", parseInt(v))}
            />
            <Control
              label="Z Index"
              value={element.props.zIndex || 1}
              onChange={(v) => handlePropChange("zIndex", parseInt(v))}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className="bg-surface border-b border-border shadow-sm">
    <div className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-background/20 transition-colors">
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
        className="text-text-muted group-hover:text-text-main transition-all transform group-hover:translate-y-0.5"
      />
    </div>
    <div className="px-4 pb-5 pt-1">{children}</div>
  </div>
);

const Control = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange?: (v: string) => void;
}) => (
  <div className="flex items-center gap-2 bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all group">
    <span className="text-[10px] font-bold text-text-muted tracking-tight w-4 group-hover:text-text-main">
      {label}
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-transparent border-none p-0 text-[12px] font-mono font-bold text-text-main focus:ring-0 text-right"
    />
  </div>
);

const IconButton = ({
  icon,
  active,
}: {
  icon: React.ReactNode;
  active?: boolean;
}) => (
  <button
    className={`
    flex-1 flex justify-center py-2.5 rounded-md transition-all
    ${active ? "bg-surface shadow-md text-primary" : "text-text-muted hover:bg-surface hover:text-text-main"}
  `}
  >
    {icon}
  </button>
);

const ChevronDown = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
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
