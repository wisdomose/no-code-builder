/**
 * Typography panel — font, size, weight, style, alignment, spacing.
 */
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
} from "lucide-react";
import { Section, Control, IconButton, CustomSelect } from "./controls";
import type { EditorElement } from "@/lib/useEditorStore";

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "JetBrains Mono",
  "Playfair Display",
  "Merriweather",
  "Montserrat",
  "Poppins",
  "Nunito",
  "Lato",
  "Open Sans",
].map((f) => ({ value: f, label: f }));

const WEIGHT_OPTIONS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Black" },
];

export function TypographyPanel({
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
      title="Typography"
      icon={<Type size={12} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {/* Font Family */}
        <CustomSelect
          label="Font"
          value={element.props.fontFamily || "Inter"}
          options={FONT_OPTIONS}
          onChange={(v) => onPropChange("fontFamily", v)}
        />

        {/* Size + Weight */}
        <div className="grid grid-cols-2 gap-3">
          <Control
            label="Size"
            value={element.props.fontSize || 16}
            onChange={(v) => onPropChange("fontSize", v)}
            min={1}
          />
          <CustomSelect
            label="Weight"
            value={String(element.props.fontWeight || 400)}
            options={WEIGHT_OPTIONS}
            onChange={(v) => onPropChange("fontWeight", v)}
          />
        </div>

        {/* Line Height + Letter Spacing */}
        <div className="grid grid-cols-2 gap-3">
          <Control
            label="Line H"
            value={
              typeof element.props.lineHeight === "number"
                ? element.props.lineHeight
                : 1.5
            }
            onChange={(v) => onPropChange("lineHeight", v)}
            min={0}
            step={0.1}
          />
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight pl-0.5">
              Spacing
            </span>
            <div className="bg-background/50 border border-border/50 rounded-lg focus-within:border-primary transition-all hover:bg-background/80 overflow-hidden">
              <input
                type="text"
                value={element.props.letterSpacing || "0px"}
                onChange={(e) => onPropChange("letterSpacing", e.target.value)}
                className="w-full bg-transparent px-2 py-1.5 text-[11px] font-mono font-bold text-text-main focus:ring-0 outline-none"
                placeholder="0px"
              />
            </div>
          </div>
        </div>

        {/* Style toggles: Bold, Italic, Underline, Strikethrough */}
        <div className="flex items-center justify-between p-0.5 bg-background border border-border rounded-lg">
          <IconButton
            icon={<Bold size={14} />}
            active={Number(element.props.fontWeight) >= 700}
            onClick={() =>
              onPropChange(
                "fontWeight",
                Number(element.props.fontWeight) >= 700 ? "400" : "700",
              )
            }
          />
          <IconButton
            icon={<Italic size={14} />}
            active={element.props.fontStyle === "italic"}
            onClick={() =>
              onPropChange(
                "fontStyle",
                element.props.fontStyle === "italic" ? "normal" : "italic",
              )
            }
          />
          <IconButton
            icon={<Underline size={14} />}
            active={element.props.textDecoration === "underline"}
            onClick={() =>
              onPropChange(
                "textDecoration",
                element.props.textDecoration === "underline"
                  ? "none"
                  : "underline",
              )
            }
          />
          <IconButton
            icon={<Strikethrough size={14} />}
            active={element.props.textDecoration === "line-through"}
            onClick={() =>
              onPropChange(
                "textDecoration",
                element.props.textDecoration === "line-through"
                  ? "none"
                  : "line-through",
              )
            }
          />
        </div>

        {/* Text Align */}
        <div className="flex items-center justify-between p-0.5 bg-background border border-border rounded-lg">
          <IconButton
            icon={<AlignLeft size={14} />}
            active={
              element.props.textAlign === "left" || !element.props.textAlign
            }
            onClick={() => onPropChange("textAlign", "left")}
          />
          <IconButton
            icon={<AlignCenter size={14} />}
            active={element.props.textAlign === "center"}
            onClick={() => onPropChange("textAlign", "center")}
          />
          <IconButton
            icon={<AlignRight size={14} />}
            active={element.props.textAlign === "right"}
            onClick={() => onPropChange("textAlign", "right")}
          />
          <IconButton
            icon={<AlignJustify size={14} />}
            active={element.props.textAlign === "justify"}
            onClick={() => onPropChange("textAlign", "justify")}
          />
        </div>

        {/* Text Transform */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            Transform
          </span>
          <div className="flex bg-background/50 rounded p-1 border border-border gap-0.5">
            {(["none", "uppercase", "lowercase", "capitalize"] as const).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => onPropChange("textTransform", t)}
                  className={`flex-1 py-1.5 rounded text-[9px] font-bold uppercase transition-all ${
                    (element.props.textTransform || "none") === t
                      ? "bg-surface text-primary shadow-sm"
                      : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {t === "none"
                    ? "—"
                    : t === "uppercase"
                      ? "AA"
                      : t === "lowercase"
                        ? "aa"
                        : "Aa"}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
