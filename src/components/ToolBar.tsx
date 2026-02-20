import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Hand,
  MessageSquare,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react";

export const ToolBar: React.FC = () => {
  const { addElement, camera, interactionState, setInteractionMode } =
    useEditorStore();

  const handleAddElement = (
    type: "div" | "text" | "image",
    variant?: "square" | "circle",
  ) => {
    const id = crypto.randomUUID();
    // Simple centering logic relative to camera
    // We ideally want center of viewport.
    // For now, place it slightly offset from top-left of current view
    const x = -camera.x + 100;
    const y = -camera.y + 100;

    const baseProps = {
      x,
      y,
      opacity: 1,
      zIndex: 1,
    };

    let props: any = { ...baseProps };

    if (type === "div") {
      props.width = 100;
      props.height = 100;
      props.background = "#d1d5db"; // gray-300
      if (variant === "circle") {
        props.borderRadius = 9999;
      } else {
        props.borderRadius = 0;
      }
    } else if (type === "text") {
      props.width = "auto";
      props.height = "auto";
      props.text = "Text Layer";
      props.fontSize = 16;
      props.color = "#000000";
    } else if (type === "image") {
      props.width = 300;
      props.height = 200;
      props.src = "https://placehold.co/600x400?text=Image";
    }

    addElement({
      id,
      type,
      props,
    });
  };

  return (
    <aside className="w-14 flex flex-col items-center py-4 gap-6 border-r border-border bg-surface shrink-0 z-20">
      {/* Search / Add Button */}
      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
        <Plus size={18} />
      </button>

      {/* Main Tools */}
      <div className="flex flex-col gap-2 w-full items-center">
        <ToolButton
          icon={<MousePointer2 size={18} />}
          active={
            interactionState.mode === "idle" ||
            interactionState.mode === "dragging"
          }
          title="Select (V)"
          onClick={() => setInteractionMode("idle")}
        />
        <ToolButton
          icon={<Square size={18} />}
          title="Frame (F)"
          onClick={() => handleAddElement("div", "square")}
        />
        <ToolButton
          icon={<Circle size={18} />}
          title="Shape (O)"
          onClick={() => handleAddElement("div", "circle")}
        />
        <ToolButton
          icon={<Type size={18} />}
          title="Text (T)"
          onClick={() => handleAddElement("text")}
        />
        <ToolButton
          icon={<ImageIcon size={18} />}
          title="Media (M)"
          onClick={() => handleAddElement("image")}
        />
        <ToolButton icon={<Hand size={18} />} title="Hand (H)" />
        <ToolButton icon={<MessageSquare size={18} />} title="Comments (C)" />
      </div>

      {/* Bottom Tools */}
      <div className="mt-auto flex flex-col gap-4">
        <button className="text-text-muted hover:text-text-main transition-colors">
          <Settings size={18} />
        </button>
        <button className="text-text-muted hover:text-text-main transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
    </aside>
  );
};

const ToolButton: React.FC<{
  icon: React.ReactNode;
  active?: boolean;
  title?: string;
  onClick?: () => void;
}> = ({ icon, active, title, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className={`
      w-10 h-10 flex items-center justify-center rounded-md transition-all
      ${
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-text-muted hover:bg-background/50 hover:text-text-main"
      }
    `}
  >
    {icon}
  </button>
);
