/**
 * Effects panel — opacity, rotation, box shadow (visual builder), background image (full suite).
 */
import React from "react";
import { Sparkles } from "lucide-react";
import { Section, SliderInput } from "./controls";
import { ColorPicker } from "../ColorPicker";
import type { EditorElement } from "@/lib/useEditorStore";

// ─── Shadow parser/composer ──────────────────────────────────────────────────

interface ShadowParts {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function parseShadow(shadow: string): ShadowParts {
  const defaults: ShadowParts = {
    x: 0,
    y: 4,
    blur: 16,
    spread: 0,
    color: "#000000",
    opacity: 0.15,
    inset: false,
  };
  if (!shadow) return defaults;

  try {
    const inset = shadow.includes("inset");
    const withoutInset = shadow.replace("inset", "").trim();

    // Extract rgba/rgb/hex color
    let color = "#000000";
    let opacity = 0.15;
    const rgbaMatch = withoutInset.match(/rgba?\(([^)]+)\)/);
    const hexMatch = withoutInset.match(/#[0-9a-fA-F]{3,8}/);

    if (rgbaMatch) {
      const parts = rgbaMatch[1].split(",").map((s) => s.trim());
      const r = parseInt(parts[0]);
      const g = parseInt(parts[1]);
      const b = parseInt(parts[2]);
      opacity = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
      color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    } else if (hexMatch) {
      color = hexMatch[0];
      opacity = 1;
    }

    // Extract numbers (replacing the color portion first)
    const withoutColor = withoutInset
      .replace(/rgba?\([^)]+\)/g, "")
      .replace(/#[0-9a-fA-F]{3,8}/g, "")
      .trim();
    const nums = withoutColor
      .split(/\s+/)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));

    return {
      x: nums[0] ?? 0,
      y: nums[1] ?? 4,
      blur: nums[2] ?? 16,
      spread: nums[3] ?? 0,
      color,
      opacity,
      inset,
    };
  } catch {
    return defaults;
  }
}

function composeShadow(p: ShadowParts): string {
  const hex = p.color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgba = `rgba(${r},${g},${b},${p.opacity.toFixed(2)})`;
  return `${p.inset ? "inset " : ""}${p.x}px ${p.y}px ${p.blur}px ${p.spread}px ${rgba}`;
}

// ─── Shadow Builder ──────────────────────────────────────────────────────────

function ShadowBuilder({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const parts = React.useMemo(() => parseShadow(value), [value]);
  const update = (patch: Partial<ShadowParts>) =>
    onChange(composeShadow({ ...parts, ...patch }));

  // Live preview style
  const previewStyle: React.CSSProperties = {
    boxShadow: value || "none",
  };

  return (
    <div className="space-y-3">
      {/* Live preview card */}
      <div className="flex items-center justify-center p-4 bg-background/50 rounded-xl border border-border/50">
        <div
          className="w-16 h-10 rounded-lg bg-surface transition-all duration-150"
          style={previewStyle}
        />
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { label: "None", val: "" },
          { label: "Soft", val: "0px 4px 16px 0px rgba(0,0,0,0.12)" },
          { label: "Lifted", val: "0px 8px 30px 0px rgba(0,0,0,0.16)" },
          { label: "Deep", val: "0px 16px 48px 0px rgba(0,0,0,0.24)" },
          { label: "Inner", val: "inset 0px 2px 6px 0px rgba(0,0,0,0.15)" },
        ].map(({ label, val }) => (
          <button
            key={label}
            onClick={() => onChange(val)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
              value === val
                ? "bg-primary border-primary text-white"
                : "bg-background/50 border-border/50 text-text-muted hover:text-text-main hover:border-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Inset toggle */}
      <button
        onClick={() => update({ inset: !parts.inset })}
        className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
          parts.inset
            ? "bg-primary/15 border-primary text-primary"
            : "bg-background/50 border-border/50 text-text-muted hover:border-border hover:text-text-main"
        }`}
      >
        {parts.inset ? "Inner shadow (on)" : "Inner shadow"}
      </button>

      {/* Numeric controls */}
      <div className="grid grid-cols-2 gap-3">
        <SliderInput
          label="Offset X"
          value={parts.x}
          onChange={(v) => update({ x: v })}
          min={-100}
          max={100}
        />
        <SliderInput
          label="Offset Y"
          value={parts.y}
          onChange={(v) => update({ y: v })}
          min={-100}
          max={100}
        />
        <SliderInput
          label="Blur"
          value={parts.blur}
          onChange={(v) => update({ blur: v })}
          min={0}
          max={100}
        />
        <SliderInput
          label="Spread"
          value={parts.spread}
          onChange={(v) => update({ spread: v })}
          min={-50}
          max={100}
        />
      </div>

      {/* Color + Alpha */}
      <SliderInput
        label="Shadow Opacity"
        value={parts.opacity}
        onChange={(v) => update({ opacity: v })}
        min={0}
        max={1}
        step={0.01}
        suffix="%"
        format={(v) => `${Math.round(v * 100)}`}
      />
      <div>
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
          Shadow Color
        </span>
        <ColorPicker
          color={parts.color}
          onChange={(c) => update({ color: c })}
        />
      </div>
    </div>
  );
}

// ─── Background Image Suite ──────────────────────────────────────────────────

function BackgroundImageSuite({
  element,
  onPropChange,
}: {
  element: EditorElement;
  onPropChange: (key: string, value: any) => void;
}) {
  const rawUrl =
    element.props.backgroundImage
      ?.replace(/^url\(["']?/, "")
      .replace(/["']?\)$/, "") ?? "";

  const [localUrl, setLocalUrl] = React.useState(rawUrl);

  // Keep local URL in sync when element changes
  React.useEffect(() => {
    setLocalUrl(rawUrl);
  }, [rawUrl]);

  const applyUrl = (url: string) => {
    onPropChange("backgroundImage", url.trim() ? `url("${url.trim()}")` : "");
  };

  // 3×3 position picker
  const posGrid = [
    ["top left", "top center", "top right"],
    ["center left", "center center", "center right"],
    ["bottom left", "bottom center", "bottom right"],
  ];
  const currentPos =
    (element as any).props.backgroundPosition ?? "center center";
  const currentSize = (element as any).props.backgroundSize ?? "cover";
  const currentRepeat = (element as any).props.backgroundRepeat ?? "no-repeat";

  return (
    <div className="space-y-4">
      {/* URL input */}
      <div>
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
          Image URL
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            onBlur={() => applyUrl(localUrl)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyUrl(localUrl);
            }}
            placeholder="https://..."
            className="flex-1 min-w-0 bg-background/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-text-main focus:border-primary outline-none transition-all"
          />
        </div>
        {/* Image preview */}
        {rawUrl && (
          <div className="mt-2 w-full h-16 rounded-lg overflow-hidden border border-border/50 bg-checkered">
            <img
              src={rawUrl}
              alt="bg preview"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      {rawUrl && (
        <>
          {/* Position picker - 3×3 grid */}
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
              Position
            </span>
            <div className="grid grid-cols-3 gap-1 p-1.5 bg-background/50 border border-border/50 rounded-lg">
              {posGrid.map((row, _r) =>
                row.map((pos, _c) => (
                  <button
                    key={pos}
                    onClick={() => onPropChange("backgroundPosition", pos)}
                    title={pos}
                    className={`h-7 rounded transition-all ${
                      currentPos === pos
                        ? "bg-primary shadow-sm"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mx-auto ${
                        currentPos === pos ? "bg-white" : "bg-text-muted/40"
                      }`}
                    />
                  </button>
                )),
              )}
            </div>
          </div>

          {/* Size */}
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
              Size
            </span>
            <div className="flex bg-background/50 rounded-lg border border-border/50 p-1 gap-0.5">
              {[
                { v: "cover", l: "Cover" },
                { v: "contain", l: "Fit" },
                { v: "auto", l: "Auto" },
                { v: "100% 100%", l: "Stretch" },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => onPropChange("backgroundSize", v)}
                  className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-all ${
                    currentSize === v
                      ? "bg-surface text-primary shadow-sm"
                      : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Repeat */}
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-2">
              Repeat
            </span>
            <div className="grid grid-cols-2 gap-1">
              {[
                { v: "no-repeat", l: "None" },
                { v: "repeat", l: "Tile" },
                { v: "repeat-x", l: "Horizontal" },
                { v: "repeat-y", l: "Vertical" },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => onPropChange("backgroundRepeat", v)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    currentRepeat === v
                      ? "bg-primary/15 border-primary text-primary"
                      : "bg-background/50 border-border/50 text-text-muted hover:border-border hover:text-text-main"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Clear button */}
          <button
            onClick={() => {
              applyUrl("");
              setLocalUrl("");
            }}
            className="w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-border/50 text-text-muted hover:border-red-500/50 hover:text-red-400 transition-all bg-background/50"
          >
            Remove Image
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function EffectsPanel({
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
  const rotationDeg = (() => {
    if (!element.props.transform) return 0;
    const m = element.props.transform.match(/rotate\(([^)]+)deg\)/);
    return m ? parseFloat(m[1]) : 0;
  })();

  const isContainer = element.type === "container" || element.type === "div";

  return (
    <Section
      title="Effects"
      icon={<Sparkles size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-5">
        {/* Opacity */}
        <SliderInput
          label="Opacity"
          value={(element.props.opacity ?? 1) * 100}
          onChange={(v) => onPropChange("opacity", Math.round(v) / 100)}
          min={0}
          max={100}
          step={1}
          suffix="%"
          format={(v) => `${Math.round(v)}`}
        />

        {/* Rotation */}
        <SliderInput
          label="Rotation"
          value={rotationDeg}
          onChange={(v) => {
            const deg = Math.round(v);
            onPropChange("transform", deg === 0 ? "" : `rotate(${deg}deg)`);
          }}
          min={-180}
          max={180}
          step={1}
          suffix="°"
          format={(v) => `${Math.round(v)}`}
        />

        {/* Box Shadow */}
        <div>
          <div className="pt-4 border-t border-border/50">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">
              Shadow
            </span>
            <ShadowBuilder
              value={element.props.boxShadow || ""}
              onChange={(v) => onPropChange("boxShadow", v)}
            />
          </div>
        </div>

        {/* Background Image (containers only) */}
        {isContainer && (
          <div className="pt-4 border-t border-border/50">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">
              Background Image
            </span>
            <BackgroundImageSuite
              element={element}
              onPropChange={onPropChange}
            />
          </div>
        )}
      </div>
    </Section>
  );
}
