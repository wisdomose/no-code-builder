import React from "react";
import {
  Layers,
  ChevronDown,
  Undo2,
  Redo2,
  Sun,
  Moon,
  Code as CodeIcon,
  Menu,
  Settings2,
  Monitor,
  Tablet,
  Smartphone,
  MoreVertical,
} from "lucide-react";
import { useEditorStore, DEVICE_WIDTHS } from "@/lib/useEditorStore";
import { useViewport } from "@/hooks/useViewport";
import { downloadProjectHtml } from "@/lib/projectHtml";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const theme = useEditorStore((s) => s.theme);
  const setTheme = useEditorStore((s) => s.setTheme);
  const scale = useEditorStore((s) => s.camera.scale);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const toggleLeftCollapse = useEditorStore((s) => s.toggleLeftCollapse);
  const toggleRightCollapse = useEditorStore((s) => s.toggleRightCollapse);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const setDeviceMode = useEditorStore((s) => s.setDeviceMode);
  const viewport = useViewport();
  const isMobile = viewport === "mobile";

  const [showDeviceMenu, setShowDeviceMenu] = React.useState(false);

  const handleExportHtml = () => {
    try {
      downloadProjectHtml(useEditorStore.getState());
      toast.success("HTML exported successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "HTML export failed.";
      toast.error(message);
    }
  };

  return (
    <header
      className={`h-14 border-b border-border flex items-center ${isMobile ? "px-2" : "px-4"} shrink-0 justify-between bg-surface z-100 select-none`}
    >
      <div className={`flex items-center ${isMobile ? "gap-2" : "gap-4"}`}>
        {isMobile && (
          <button
            onClick={toggleLeftCollapse}
            className="p-2 -ml-2 hover:bg-surface rounded-md text-text-muted transition-colors"
          >
            <Menu size={18} />
          </button>
        )}
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
        <div className="hidden md:block h-4 w-px bg-border mx-1" />
        <div className="hidden md:flex items-center gap-2 text-[12px] font-medium text-text-muted">
          <span className="hover:text-text-main cursor-pointer transition-colors">
            Workspace
          </span>
          <span className="opacity-30">/</span>
          <span className="text-text-main font-semibold">Project One</span>
          <ChevronDown size={14} className="opacity-50" />
        </div>
        {isMobile && (
          <button
            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
            className={`p-1.5 rounded-md transition-colors ${showDeviceMenu ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface"}`}
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>

      {/* Device Mode Selectors */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 bg-background/50 border border-border rounded-lg px-2 py-1 shadow-sm">
        <div className="flex items-center gap-1.5 p-0.5">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-md transition-all ${
              deviceMode === "desktop"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-text-main hover:bg-surface/50"
            }`}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded-md transition-all ${
              deviceMode === "tablet"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-text-main hover:bg-surface/50"
            }`}
            title="Tablet View"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-md transition-all ${
              deviceMode === "mobile"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-text-main hover:bg-surface/50"
            }`}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-3 text-[11px] font-mono pr-2">
          <span className="text-text-muted uppercase tracking-wider text-[9px] font-bold">
            Canvas
          </span>
          <span className="text-text-main font-semibold min-w-12.5">
            {DEVICE_WIDTHS[deviceMode]}{" "}
            <span className="text-[9px] opacity-40 font-normal">PX</span>
          </span>
          <div className="w-px h-3 bg-border" />
          <span className="text-primary font-bold">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      <div className={`flex items-center ${isMobile ? "gap-1.5" : "gap-3"}`}>
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

        {!isMobile && <div className="h-6 w-px bg-border mx-1" />}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-background rounded-full text-text-muted hover:text-text-main transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={handleExportHtml}
          className="hidden md:flex items-center gap-2 bg-text-main text-surface hover:bg-text-main/90 px-4 py-1.5 text-xs md:text-[13px] md:px-4 rounded-lg font-semibold transition-all shadow-sm"
          title="Export Code"
        >
          <CodeIcon size={14} />
          Export Code
        </button>
        {isMobile && (
          <button
            onClick={toggleRightCollapse}
            className="p-2 -mr-2 hover:bg-surface rounded-md text-text-muted transition-colors"
          >
            <Settings2 size={18} />
          </button>
        )}
      </div>
      {/* Mobile Device Switcher Overflow */}
      {isMobile && showDeviceMenu && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-b-lg shadow-xl py-2 px-3 z-150 flex items-center gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setDeviceMode("desktop");
                setShowDeviceMenu(false);
              }}
              className={`p-2 rounded-md ${deviceMode === "desktop" ? "bg-background text-primary" : "text-text-muted"}`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => {
                setDeviceMode("tablet");
                setShowDeviceMenu(false);
              }}
              className={`p-2 rounded-md ${deviceMode === "tablet" ? "bg-background text-primary" : "text-text-muted"}`}
              title="Tablet View"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => {
                setDeviceMode("mobile");
                setShowDeviceMenu(false);
              }}
              className={`p-2 rounded-md ${deviceMode === "mobile" ? "bg-background text-primary" : "text-text-muted"}`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="text-[10px] font-mono font-bold text-text-main">
            {DEVICE_WIDTHS[deviceMode]}PX
          </div>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={handleExportHtml}
            className="text-[10px] font-bold uppercase tracking-wide text-text-main bg-background hover:bg-surface border border-border px-2 py-1 rounded transition-colors"
          >
            Export
          </button>
        </div>
      )}
    </header>
  );
};
