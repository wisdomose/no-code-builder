import * as Popover from "@radix-ui/react-popover";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

/**
 * A senior-level Color Picker using Radix UI for Portal support (no clipping)
 * and react-colorful for a high-fidelity interaction model.
 */
export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const presets = [
    "#4f46e5",
    "#10b981",
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#ffffff",
    "#000000",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#6366f1",
  ];

  // Ensure color is valid hex for react-colorful
  const validColor = color.startsWith("#") ? color : "#ffffff";

  return (
    <div className="flex items-center gap-3">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="w-10 h-10 rounded-lg border border-border flex-shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ backgroundColor: color }}
            title="Open color picker"
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-[1000] w-64 p-3 bg-surface border border-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 outline-none"
            sideOffset={12}
            align="start"
            collisionPadding={16}
          >
            <div className="space-y-4">
              {/* Proper Color Canvas */}
              <div className="custom-color-picker">
                <HexColorPicker color={validColor} onChange={onChange} />
              </div>

              {/* Hex Input & Preview */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded px-2 py-1.5 focus-within:border-primary transition-colors">
                  <span className="text-[10px] font-bold text-text-muted">
                    HEX
                  </span>
                  <HexColorInput
                    color={validColor}
                    onChange={onChange}
                    prefixed
                    className="bg-transparent border-none p-0 text-[11px] font-mono font-bold text-text-main focus:ring-0 w-full outline-none uppercase"
                  />
                </div>
                <div
                  className="w-8 h-8 rounded border border-white/10 shadow-inner"
                  style={{ backgroundColor: validColor }}
                />
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-6 gap-2 pt-2 border-t border-border/50">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => onChange(p)}
                    className="w-full aspect-square rounded-md border border-white/5 transition-all hover:scale-110 active:scale-90 shadow-sm"
                    style={{ backgroundColor: p }}
                    title={p}
                  />
                ))}
              </div>
            </div>

            <Popover.Arrow className="fill-border" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[11px] font-mono font-bold text-text-main truncate uppercase">
          {color}
        </span>
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-tight">
          Fill Color
        </span>
      </div>
    </div>
  );
}
