/**
 * Shared sub-components used by all PropertyInspector panels.
 */
import React from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

// ─── Section Wrapper ──────────────────────────────────────────────────────────

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

// ─── Numeric Control ──────────────────────────────────────────────────────────

export function Control({
  label,
  value,
  onChange,
  onToggleAuto,
  readOnly,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number | string | "auto";
  onChange?: (v: number | "auto") => void;
  onToggleAuto?: () => void;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
}) {
  const handleWheel = (e: React.WheelEvent) => {
    if (readOnly || !onChange || value === "auto") return;
    const delta = e.deltaY < 0 ? step : -step;
    const newVal = Number(value) + delta;
    const clamped = min !== undefined ? Math.max(min, newVal) : newVal;
    const clamped2 = max !== undefined ? Math.min(max, clamped) : clamped;
    onChange(clamped2);
  };

  const isAuto = value === "auto";
  const shortLabel = label === "Width" ? "W" : label === "Height" ? "H" : label;
  const showAutoToggle =
    (label === "Width" ||
      label === "Height" ||
      label === "W" ||
      label === "H") &&
    !readOnly &&
    (onChange || onToggleAuto);

  return (
    <div className="flex flex-col gap-1.5 min-w-0 group relative">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight group-hover:text-text-main transition-colors pl-0.5">
        {shortLabel}
      </span>
      <div className="relative flex items-center bg-background/50 border border-border/50 rounded-lg focus-within:border-primary transition-all hover:bg-background/80">
        <input
          type={isAuto ? "text" : "number"}
          value={isAuto ? "Auto" : value}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          onWheel={handleWheel}
          onChange={(e) => {
            const val = e.target.value;
            if (val.toLowerCase() === "auto") {
              onChange?.("auto");
            } else {
              const num = val === "" ? 0 : Number(val);
              const clamped = min !== undefined ? Math.max(min, num) : num;
              const clamped2 =
                max !== undefined ? Math.min(max, clamped) : clamped;
              onChange?.(clamped2);
            }
          }}
          className={`
            w-full bg-transparent border-none px-2 py-1.5 text-[11px] font-mono font-bold text-text-main focus:ring-0 outline-none
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${readOnly ? "cursor-default opacity-50" : "cursor-ns-resize"}
            ${isAuto ? "text-primary uppercase tracking-wider" : ""}
          `}
        />
        {showAutoToggle && (
          <button
            onClick={() => {
              if (onToggleAuto) onToggleAuto();
              else onChange!(isAuto ? 100 : "auto");
            }}
            className={`
              mr-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider transition-colors shrink-0
              ${isAuto ? "bg-primary text-white" : "bg-border/50 text-text-muted hover:bg-primary/20 hover:text-primary"}
            `}
            title={isAuto ? "Switch to fixed size" : "Switch to auto size"}
          >
            {isAuto ? "FIX" : "AUTO"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  /** Optional small preview swatch/icon rendered to the left */
  preview?: React.ReactNode;
};

export function CustomSelect<T extends string = string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5 min-w-0" ref={ref}>
      {label && (
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight pl-0.5">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 bg-background/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-text-main hover:bg-background/80 hover:border-border focus:border-primary outline-none transition-all"
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            {selected?.preview && (
              <span className="shrink-0">{selected.preview}</span>
            )}
            <span className="truncate">{selected?.label ?? value}</span>
          </span>
          <ChevronDown
            size={12}
            className={`text-text-muted shrink-0 transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {open && (
          <div
            className="absolute z-[9999] left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top"
            style={{ minWidth: "100%" }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold transition-colors text-left ${
                  opt.value === value
                    ? "bg-primary/15 text-primary"
                    : "text-text-muted hover:bg-background/60 hover:text-text-main"
                }`}
              >
                {opt.preview && <span className="shrink-0">{opt.preview}</span>}
                {opt.label}
                {opt.value === value && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Slider + Input  combo ────────────────────────────────────────────────────

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v) => String(v),
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={format(value)}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-12 bg-background/50 border border-border/50 rounded-md px-1 py-0.5 text-[11px] font-mono font-bold text-text-main text-right focus:border-primary outline-none transition-all
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="text-[10px] text-text-muted font-bold">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <div className="relative h-4 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-background/50 border border-border/30 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-4"
        />
        {/* Custom thumb */}
        <div
          className="absolute w-3.5 h-3.5 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-none"
          style={{ left: `clamp(0%, ${pct}%, calc(100% - 14px))` }}
        />
      </div>
    </div>
  );
}

// ─── Icon Toggle Button ───────────────────────────────────────────────────────

export function IconButton({
  icon,
  active,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
      flex-1 flex justify-center py-2.5 rounded-md transition-all
      ${active ? "bg-surface shadow-md text-primary" : "text-text-muted hover:bg-surface hover:text-text-main"}
    `}
    >
      {icon}
    </button>
  );
}

// ─── Grid Counter ─────────────────────────────────────────────────────────────

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
    return value.split(" ").filter(Boolean).length;
  }, [value]);

  const updateCount = (newCount: number) => {
    if (newCount < 1) return;
    const unit = isRow ? "auto" : "1fr";
    onChange(Array(newCount).fill(unit).join(" "));
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-0 group relative">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight pl-0.5">
        {label}
      </span>
      <div className="flex items-center justify-between bg-background/50 border border-border/50 rounded-lg p-1">
        <button
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-text-muted hover:text-white transition-all active:scale-90"
          onClick={() => updateCount(count - 1)}
        >
          <Minus size={12} />
        </button>
        <span className="text-[11px] font-mono font-bold text-text-main w-6 text-center select-none">
          {count}
        </span>
        <button
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-text-muted hover:text-white transition-all active:scale-90"
          onClick={() => updateCount(count + 1)}
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── 3×3 Alignment Matrix ────────────────────────────────────────────────────

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
      <div className="w-full aspect-square max-w-[112px] mx-auto bg-background/50 rounded-lg p-1.5 border border-border grid grid-cols-3 grid-rows-3 gap-1">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const active = isActive(row, col);
            return (
              <button
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                className={`w-full h-full rounded transition-all ${
                  active ? "bg-primary shadow-sm" : "hover:bg-white/10"
                }`}
                title={`${["Top", "Middle", "Bottom"][row]} ${["Left", "Center", "Right"][col]}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mx-auto ${
                    active ? "bg-white" : "bg-text-muted/50"
                  }`}
                />
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
