/**
 * Shared sub-components used by all PropertyInspector panels.
 */
import React from "react";
import { ChevronDown } from "lucide-react";
import { Plus, Minus } from "lucide-react";

// --- Section Wrapper ---
export function Section({
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

// --- Numeric / Auto Control ---
export function Control({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: number | string | "auto";
  onChange?: (v: number | "auto") => void;
  readOnly?: boolean;
}) {
  const handleWheel = (e: React.WheelEvent) => {
    if (readOnly || !onChange || value === "auto") return;
    const delta = e.deltaY < 0 ? 1 : -1;
    onChange(Number(value) + delta);
  };

  const isAuto = value === "auto";

  return (
    <div className="flex flex-col gap-1.5 min-w-0 group relative">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight group-hover:text-text-main transition-colors pl-0.5">
        {label === "Width" ? "W" : label === "Height" ? "H" : label}
      </span>
      <div className="relative flex items-center bg-background/50 border border-border/50 rounded-lg focus-within:border-primary transition-all hover:bg-background/80">
        <input
          type={isAuto ? "text" : "number"}
          value={isAuto ? "Auto" : value}
          readOnly={readOnly}
          onWheel={handleWheel}
          onChange={(e) => {
            const val = e.target.value;
            if (val.toLowerCase() === "auto") {
              onChange?.("auto");
            } else {
              onChange?.(val === "" ? 0 : Number(val));
            }
          }}
          className={`
            w-full bg-transparent border-none px-2 py-1.5 text-[11px] font-mono font-bold text-text-main focus:ring-0 outline-none
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${readOnly ? "cursor-default opacity-50" : "cursor-ns-resize"}
            ${isAuto ? "text-primary uppercase tracking-wider" : ""}
          `}
        />
        {(label === "Width" ||
          label === "Height" ||
          label === "W" ||
          label === "H") &&
          !readOnly &&
          onChange && (
            <button
              onClick={() => onChange(isAuto ? 100 : "auto")}
              className={`
                  mr-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider transition-colors shrink-0
                  ${isAuto ? "bg-primary text-white" : "bg-border/50 text-text-muted hover:bg-primary/20 hover:text-primary"}
              `}
              title={isAuto ? "Switch to Fixed Size" : "Switch to Auto Size"}
            >
              {isAuto ? "FIX" : "AUTO"}
            </button>
          )}
      </div>
    </div>
  );
}

// --- Icon Toggle Button ---
export function IconButton({
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

// --- Grid Column/Row Counter ---
export function GridCounter({
  label,
  value,
  onChange,
  isRow = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isRow?: boolean;
}) {
  const count = React.useMemo(() => {
    if (!value || value === "auto") return 1;
    return value.split(" ").length;
  }, [value]);

  const updateCount = (newCount: number) => {
    if (newCount < 1) return;
    const customVal = isRow ? "auto" : "1fr";
    const newVal = Array(newCount).fill(customVal).join(" ");
    onChange(newVal);
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-0 group relative">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight group-hover:text-text-main transition-colors pl-0.5">
        {label}
      </span>
      <div className="relative flex items-center justify-between bg-background/50 border border-border/50 rounded-lg p-1 focus-within:border-primary transition-all hover:bg-background/80">
        <button
          className="w-5 h-5 flex items-center justify-center rounded bg-transparent hover:bg-white/10 text-text-muted hover:text-white transition-all active:scale-90"
          onClick={() => updateCount(count - 1)}
        >
          <Minus size={12} />
        </button>
        <span className="text-[11px] font-mono font-bold text-text-main w-6 text-center select-none">
          {count}
        </span>
        <button
          className="w-5 h-5 flex items-center justify-center rounded bg-transparent hover:bg-white/10 text-text-muted hover:text-white transition-all active:scale-90"
          onClick={() => updateCount(count + 1)}
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

// --- 3x3 Alignment Matrix ---
export function AlignmentMatrix({
  alignItems,
  justifyContent,
  flexDirection,
  onAlignChange,
  onJustifyChange,
}: {
  alignItems: string;
  justifyContent: string;
  flexDirection: string;
  onAlignChange: (val: string) => void;
  onJustifyChange: (val: string) => void;
}) {
  const isRow = flexDirection === "row" || !flexDirection;

  const handleClick = (row: number, col: number) => {
    const yAlign = ["start", "center", "end"][row];
    const xAlign = ["start", "center", "end"][col];
    if (isRow) {
      onAlignChange(yAlign);
      onJustifyChange(xAlign);
    } else {
      onJustifyChange(yAlign);
      onAlignChange(xAlign);
    }
  };

  const isActive = (row: number, col: number) => {
    const yTarget = ["start", "center", "end"][row];
    const xTarget = ["start", "center", "end"][col];
    if (isRow) {
      return alignItems === yTarget && justifyContent === xTarget;
    } else {
      return justifyContent === yTarget && alignItems === xTarget;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
        Placement
      </span>
      <div className="w-full aspect-square max-w-[120px] mx-auto bg-background/50 rounded-lg p-1.5 border border-border grid grid-cols-3 grid-rows-3 gap-1">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const active = isActive(row, col);
            return (
              <button
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                className={`
                  w-full h-full rounded transition-all flex items-center justify-center
                  ${active ? "bg-primary shadow-sm" : "hover:bg-white/10"}
                `}
                title={`Align: ${["Top", "Middle", "Bottom"][row]} - ${["Left", "Center", "Right"][col]}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : "bg-text-muted/50"}`}
                />
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
