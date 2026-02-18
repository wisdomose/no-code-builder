import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  position: "left" | "right";
  title: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  isCollapsed,
  onToggleCollapse,
  width,
  position,
  title,
  icon,
}) => {
  return (
    <div
      className={`
        h-full bg-sidebar border-sidebar-border flex flex-col transition-[width] duration-300 ease-in-out
        ${position === "left" ? "border-r" : "border-l"}
      `}
      style={{ width: isCollapsed ? "48px" : `${width}px` }}
    >
      <div className="h-12 border-b border-sidebar-border flex items-center justify-between px-3 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-semibold truncate text-sidebar-foreground">
            {icon}
            <span>{title}</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-sidebar-accent rounded-md text-sidebar-foreground transition-colors mx-auto"
        >
          {isCollapsed ? (
            position === "left" ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )
          ) : position === "left" ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>
      <div
        className={`flex-1 overflow-auto ${isCollapsed ? "hidden" : "block"}`}
      >
        {children}
      </div>
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4 gap-4">
          <div className="text-sidebar-foreground/60">{icon}</div>
        </div>
      )}
    </div>
  );
};
