import React from "react";
import { useEditorStore } from "@/lib/useEditorStore";

export const StatusBar: React.FC = () => {
  const { camera } = useEditorStore();

  return (
    <footer className="h-8 border-t border-border bg-surface flex items-center px-4 justify-between text-[11px] text-text-muted font-medium select-none z-[100] shrink-0">
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />{" "}
          Connected
        </span>
        <span>Personal Workspace</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center font-mono text-[10px] gap-3">
          <span className="opacity-40 uppercase text-[9px] font-bold tracking-tighter">
            Pos
          </span>
          <span>X: {Math.round(camera.x)}px</span>
          <span>Y: {Math.round(camera.y)}px</span>
        </div>
      </div>
    </footer>
  );
};
