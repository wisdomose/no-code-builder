import React from "react";
import { useEditorStore } from "../lib/useEditorStore";

export const PropertyInspector: React.FC = () => {
  const { selectedId, elements, updateElement } = useEditorStore();
  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!selectedElement) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground italic">
        Select an element to view properties.
      </div>
    );
  }

  const { props } = selectedElement;

  const handleChange = (key: string, value: any) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
      {children}
    </label>
  );

  const Input = ({ ...rest }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...rest}
      className="w-full bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold mb-3">Dimensions</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>X Position</Label>
            <Input
              type="number"
              value={props.x}
              onChange={(e) => handleChange("x", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Y Position</Label>
            <Input
              type="number"
              value={props.y}
              onChange={(e) => handleChange("y", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Width</Label>
            <Input
              type="number"
              value={props.width}
              onChange={(e) =>
                handleChange("width", parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label>Height</Label>
            <Input
              type="number"
              value={props.height}
              onChange={(e) =>
                handleChange("height", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-semibold mb-3">Content & Styles</h3>
        <div className="flex flex-col gap-4">
          {(selectedElement.type === "text" ||
            selectedElement.type === "button") && (
            <div>
              <Label>Text Content</Label>
              <Input
                type="text"
                value={props.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={props.color || ""}
                onChange={(e) => handleChange("color", e.target.value)}
              />
              <input
                type="color"
                value={props.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-8 h-8 rounded border border-border p-0 cursor-pointer overflow-hidden"
              />
            </div>
          </div>

          {(selectedElement.type === "button" ||
            selectedElement.type === "container") && (
            <div>
              <Label>Background</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={props.background || ""}
                  onChange={(e) => handleChange("background", e.target.value)}
                />
                <input
                  type="color"
                  value={props.background || "#ffffff"}
                  onChange={(e) => handleChange("background", e.target.value)}
                  className="w-8 h-8 rounded border border-border p-0 cursor-pointer overflow-hidden"
                />
              </div>
            </div>
          )}

          {selectedElement.type === "image" && (
            <div>
              <Label>Image URL</Label>
              <Input
                type="text"
                value={props.src || ""}
                onChange={(e) => handleChange("src", e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={() =>
            useEditorStore.getState().removeElement(selectedElement.id)
          }
          className="w-full py-2 bg-destructive/10 text-destructive text-sm font-medium rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Delete Element
        </button>
      </div>
    </div>
  );
};
