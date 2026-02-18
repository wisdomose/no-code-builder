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
        h-full bg-card border-border flex flex-col select-none
        ${position === "left" ? "border-r" : "border-l"}
      `}
      style={{ width: isCollapsed ? "48px" : `${width}px` }}
    >
      <div className="h-9 border-b border-border flex items-center px-2 shrink-0 bg-muted/30">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground truncate flex-1">
              <span className="text-foreground/70">{icon}</span>
              <span>{title}</span>
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-1 hover:bg-accent hover:text-accent-foreground rounded text-muted-foreground transition-colors shrink-0"
              title="Collapse"
            >
              {position === "left" ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 w-full hover:bg-accent hover:text-accent-foreground rounded text-muted-foreground transition-colors flex items-center justify-center"
            title="Expand"
          >
            {position === "left" ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        )}
      </div>

      <div
        className={`flex-1 overflow-auto ${isCollapsed ? "hidden" : "block"}`}
      >
        {children}
      </div>

      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4 gap-4 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}
    </div>
  );
};
