import React from "react";
import {
  Layers,
  ChevronDown,
  Undo2,
  Redo2,
  Sun,
  Moon,
  Share2,
  Eye,
} from "lucide-react";
import { useEditorStore } from "@/lib/useEditorStore";

export const Header: React.FC = () => {
  const theme = useEditorStore((s) => s.theme);
  const setTheme = useEditorStore((s) => s.setTheme);
  const scale = useEditorStore((s) => s.camera.scale);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  return (
    <header className="h-14 border-b border-border flex items-center px-4 shrink-0 justify-between bg-surface z-[100] select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 font-bold text-[14px] tracking-tight">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white shadow-sm shadow-primary/20">
            <Layers size={18} />
          </div>
          <div className="flex flex-col">
            <span className="leading-none text-text-main">Codex</span>
            <span className="text-[10px] text-text-muted font-medium mt-0.5 tracking-wider uppercase">
              Beta
            </span>
          </div>
        </div>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <div className="flex items-center gap-2 text-[12px] font-medium text-text-muted">
          <span className="hover:text-text-main cursor-pointer transition-colors">
            Workspace
          </span>
          <span className="opacity-30">/</span>
          <span className="text-text-main font-semibold">Project One</span>
          <ChevronDown size={14} className="opacity-50" />
        </div>
      </div>

      {/* Device Mode Selectors */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/50 border border-border rounded-lg px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-mono font-medium opacity-70">
          <div className="p-1 rounded hover:bg-surface transition-colors cursor-pointer text-primary">
            Desktop
          </div>
          <div className="p-1 rounded hover:bg-surface transition-colors cursor-pointer">
            Tablet
          </div>
          <div className="p-1 rounded hover:bg-surface transition-colors cursor-pointer">
            Mobile
          </div>
        </div>
        <div className="h-4 w-[1px] bg-border" />
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-text-muted uppercase">Canvas</span>
          <span className="text-text-main">
            1440 <span className="text-[9px] opacity-40">PX</span>
          </span>
          <span className="text-primary font-bold">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Undo/Redo */}
        <div className="flex items-center bg-background/30 rounded-md border border-border p-0.5">
          <button
            onClick={() => undo()}
            className="p-1.5 hover:bg-surface rounded-md text-text-muted hover:text-text-main transition-all"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => redo()}
            className="p-1.5 hover:bg-surface rounded-md text-text-muted hover:text-text-main transition-all"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-border mx-1" />

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-background rounded-full text-text-muted hover:text-text-main transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 hover:bg-background rounded-full text-text-muted hover:text-text-main transition-colors">
          <Share2 size={18} />
        </button>
        <button className="p-2 hover:bg-background rounded-full text-text-muted hover:text-text-main transition-colors">
          <Eye size={18} />
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/20">
          Publish
        </button>
      </div>
    </header>
  );
};
