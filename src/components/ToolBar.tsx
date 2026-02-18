import React from "react";
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
          active
          title="Select (V)"
        />
        <ToolButton icon={<Square size={18} />} title="Frame (F)" />
        <ToolButton icon={<Circle size={18} />} title="Shape (O)" />
        <ToolButton icon={<Type size={18} />} title="Text (T)" />
        <ToolButton icon={<ImageIcon size={18} />} title="Media (M)" />
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
}> = ({ icon, active, title }) => (
  <button
    title={title}
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
