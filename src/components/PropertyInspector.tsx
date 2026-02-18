import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";

export const PropertyInspector: React.FC = () => {
  const { selectedId, elements, updateElement } = useEditorStore();
  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!selectedElement) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center text-[11px] text-muted-foreground italic leading-relaxed opacity-60">
        Select an element on the canvas to edit its properties.
      </div>
    );
  }

  const { props } = selectedElement;

  const handleChange = (key: string, value: any) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-border py-3 px-3">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 leading-none">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">{children}</div>
    </div>
  );

  const Control = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-muted-foreground font-medium">
        {label}
      </label>
      {children}
    </div>
  );

  const Input = ({
    className = "",
    ...rest
  }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...rest}
      className={`w-full bg-muted/40 border-none rounded-[3px] px-1.5 py-1 text-[11px] font-mono focus:ring-1 focus:ring-[#007aff] transition-shadow ${className}`}
    />
  );

  return (
    <div className="flex flex-col h-full bg-card overflow-y-auto no-scrollbar">
      <Section title="Layout">
        <Control label="X">
          <Input
            type="number"
            value={props.x}
            onChange={(e) => handleChange("x", parseInt(e.target.value) || 0)}
          />
        </Control>
        <Control label="Y">
          <Input
            type="number"
            value={props.y}
            onChange={(e) => handleChange("y", parseInt(e.target.value) || 0)}
          />
        </Control>
        <Control label="Width">
          <Input
            type="number"
            value={props.width}
            onChange={(e) =>
              handleChange("width", parseInt(e.target.value) || 0)
            }
          />
        </Control>
        <Control label="Height">
          <Input
            type="number"
            value={props.height}
            onChange={(e) =>
              handleChange("height", parseInt(e.target.value) || 0)
            }
          />
        </Control>
      </Section>

      <Section title="Appearance">
        {selectedElement.type === "text" ||
        selectedElement.type === "button" ? (
          <>
            <div className="col-span-2">
              <Control label="Text Content">
                <Input
                  type="text"
                  value={props.text || ""}
                  onChange={(e) => handleChange("text", e.target.value)}
                />
              </Control>
            </div>
            <Control label="Font Size">
              <Input
                type="number"
                value={props.fontSize || 16}
                onChange={(e) =>
                  handleChange("fontSize", parseInt(e.target.value) || 0)
                }
              />
            </Control>
            <Control label="Text Color">
              <div className="flex gap-1.5">
                <div
                  className="w-6 h-6 rounded border border-border shrink-0 cursor-pointer"
                  style={{ backgroundColor: props.color || "#000000" }}
                  onClick={() =>
                    document.getElementById("color-picker")?.click()
                  }
                />
                <Input
                  type="text"
                  value={props.color || ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="uppercase"
                />
                <input
                  id="color-picker"
                  type="color"
                  className="hidden"
                  value={props.color || "#000000"}
                  onChange={(e) => handleChange("color", e.target.value)}
                />
              </div>
            </Control>
          </>
        ) : null}

        {(selectedElement.type === "button" ||
          selectedElement.type === "container") && (
          <>
            <Control label="Background">
              <div className="flex gap-1.5">
                <div
                  className="w-6 h-6 rounded border border-border shrink-0 cursor-pointer"
                  style={{ backgroundColor: props.background || "#ffffff" }}
                  onClick={() => document.getElementById("bg-picker")?.click()}
                />
                <Input
                  type="text"
                  value={props.background || ""}
                  onChange={(e) => handleChange("background", e.target.value)}
                  className="uppercase"
                />
                <input
                  id="bg-picker"
                  type="color"
                  className="hidden"
                  value={props.background || "#ffffff"}
                  onChange={(e) => handleChange("background", e.target.value)}
                />
              </div>
            </Control>
            <Control label="Radius">
              <Input
                type="number"
                value={props.borderRadius || 0}
                onChange={(e) =>
                  handleChange("borderRadius", parseInt(e.target.value) || 0)
                }
              />
            </Control>
          </>
        )}
      </Section>

      <div className="mt-auto p-3 bg-muted/20">
        <button
          onClick={() =>
            useEditorStore.getState().removeElement(selectedElement.id)
          }
          className="w-full py-2 bg-destructive/5 text-destructive text-[11px] font-bold rounded-[4px] hover:bg-destructive hover:text-white transition-all uppercase tracking-tight"
        >
          Delete Element
        </button>
      </div>
    </div>
  );
};
