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
        h-full bg-surface border-border flex flex-col select-none
        ${position === "left" ? "border-r" : "border-l"}
        transition-all duration-200 ease-in-out
      `}
      style={{ width: isCollapsed ? "48px" : `${width}px` }}
    >
      <div className="h-10 border-b border-border flex items-center px-2 shrink-0 bg-background/30">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-[0.1em] text-text-muted truncate flex-1">
              <span className="text-primary/70">{icon}</span>
              <span>{title}</span>
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-surface hover:text-text-main rounded-md text-text-muted transition-all shrink-0"
              title="Collapse"
            >
              {position === "left" ? (
                <ChevronLeft size={14} strokeWidth={2.5} />
              ) : (
                <ChevronRight size={14} strokeWidth={2.5} />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-2 w-full hover:bg-surface hover:text-primary rounded-md text-text-muted transition-all flex items-center justify-center"
            title="Expand"
          >
            {position === "left" ? (
              <ChevronRight size={14} strokeWidth={2.5} />
            ) : (
              <ChevronLeft size={14} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>

      <div
        className={`flex-1 overflow-auto no-scrollbar ${isCollapsed ? "hidden" : "block"}`}
      >
        {children}
      </div>

      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-6 gap-6 text-text-muted/40">
          {icon}
        </div>
      )}
    </div>
  );
};
