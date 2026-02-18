import { useRef, useEffect } from "react";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Codex - Professional Design Tool" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

import {
  Layers,
  Settings2,
  Share2,
  Undo2,
  Redo2,
  Eye,
  ChevronDown,
  Moon,
  Sun,
  Maximize,
  Box,
  Database,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ToolBar } from "@/components/ToolBar";
import { ResizeHandle } from "@/components/ResizeHandle";
import { useEditorStore } from "@/lib/useEditorStore";
import { Canvas } from "@/components/Canvas";
import { Artboard } from "@/components/Artboard";
import { LayerTree } from "@/components/LayerTree";
import { PropertyInspector } from "@/components/PropertyInspector";

function RootDocument() {
  const {
    layout,
    setLeftWidth,
    setRightWidth,
    toggleLeftCollapse,
    toggleRightCollapse,
    camera,
    resetCamera,
    theme,
    setTheme,
  } = useEditorStore();

  const mainRef = useRef<HTMLElement>(null);

  const handleResetCamera = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (mainRef.current) {
      // Small delay to ensure layout has computed
      requestAnimationFrame(() => {
        if (mainRef.current) {
          const { clientWidth, clientHeight } = mainRef.current;
          resetCamera(clientWidth, clientHeight);
        }
      });
    } else {
      resetCamera();
    }
  };

  useEffect(() => {
    // Center on mount
    handleResetCamera();

    // Also center on window resize to keep it robust
    const handleResize = () => handleResetCamera();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { leftWidth, rightWidth, isLeftCollapsed, isRightCollapsed } = layout;

  return (
    <html lang="en" className={theme}>
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="flex flex-col h-screen overflow-hidden bg-background text-text-main">
          {/* Editor Header - Professional Tool Chrome */}
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
                <span className="text-text-main font-semibold">
                  Project One
                </span>
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
                  {Math.round(camera.scale * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Undo/Redo */}
              <div className="flex items-center bg-background/30 rounded-md border border-border p-0.5">
                <button
                  onClick={() => useEditorStore.getState().undo()}
                  className="p-1.5 hover:bg-surface rounded-md text-text-muted hover:text-text-main transition-all"
                  title="Undo"
                >
                  <Undo2 size={16} />
                </button>
                <button
                  onClick={() => useEditorStore.getState().redo()}
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

          <div className="flex flex-1 overflow-hidden">
            {/* Zone 1: Far Left ToolBar */}
            <ToolBar />

            {/* Main Editor Grid Layout */}
            <div
              className="flex-1 grid overflow-hidden relative"
              style={{
                gridTemplateColumns: `
                  ${isLeftCollapsed ? "48px" : `${leftWidth}px`}
                  1fr
                  ${isRightCollapsed ? "48px" : `${rightWidth}px`}
                `,
              }}
            >
              {/* Left Sidebar - Navigator */}
              <div className="relative group h-full z-10">
                <Sidebar
                  position="left"
                  title="Layers"
                  icon={<Layers size={14} />}
                  width={leftWidth}
                  isCollapsed={isLeftCollapsed}
                  onToggleCollapse={toggleLeftCollapse}
                >
                  <div className="p-1 border-b border-border flex gap-1 bg-background/30 mx-2 mt-2 rounded">
                    <SidebarTab
                      label="Layers"
                      active
                      icon={<Layers size={11} />}
                    />
                    <SidebarTab label="Assets" icon={<Box size={11} />} />
                    <SidebarTab
                      label="Sections"
                      icon={<Database size={11} />}
                    />
                  </div>
                  <LayerTree />
                </Sidebar>
                {!isLeftCollapsed && (
                  <div className="absolute top-0 -right-0.5 bottom-0 z-[20]">
                    <ResizeHandle
                      position="right"
                      onResize={(delta) => {
                        const currentWidth =
                          useEditorStore.getState().layout.leftWidth;
                        setLeftWidth(currentWidth + delta);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Spatial Workspace */}
              <main
                ref={mainRef}
                className="h-full relative overflow-hidden flex flex-col bg-background canvas-grid"
              >
                <Canvas>
                  <Artboard />
                </Canvas>

                {/* Floating On-Canvas Zoom Indicator */}
                <div className="absolute bottom-6 right-6 flex items-center bg-[#1e2229] border border-[#2d313a] rounded-lg p-0.5 shadow-2xl z-50 transition-all hover:scale-105">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-white tracking-widest min-w-[50px] text-center">
                    {Math.round(camera.scale * 100)}%
                  </div>
                  <div className="w-[1px] h-4 bg-[#2d313a] mx-0.5" />
                  <button
                    onClick={handleResetCamera}
                    className="p-1.5 hover:bg-[#2d313a] rounded-md text-gray-400 hover:text-white transition-all"
                    title="Reset Zoom & Pan (Ctrl+0)"
                  >
                    <Maximize size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </main>

              {/* Right Sidebar - Design */}
              <div className="relative group h-full z-10">
                {!isRightCollapsed && (
                  <div className="absolute top-0 -left-0.5 bottom-0 z-[20]">
                    <ResizeHandle
                      position="left"
                      onResize={(delta) => {
                        const currentWidth =
                          useEditorStore.getState().layout.rightWidth;
                        setRightWidth(currentWidth + delta);
                      }}
                    />
                  </div>
                )}
                <Sidebar
                  position="right"
                  title="Design"
                  icon={<Settings2 size={14} />}
                  width={rightWidth}
                  isCollapsed={isRightCollapsed}
                  onToggleCollapse={toggleRightCollapse}
                >
                  <div className="p-1 border-b border-border flex gap-1 bg-background/30 mx-2 mt-2 rounded">
                    <SidebarTab
                      label="Design"
                      active
                      icon={<Settings2 size={11} />}
                    />
                    <SidebarTab label="Pages" icon={<Layers size={11} />} />
                  </div>
                  <PropertyInspector />
                </Sidebar>
              </div>
            </div>
          </div>

          {/* Status Bar */}
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
        </div>

        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

const SidebarTab = ({
  label,
  active,
  icon,
}: {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
}) => (
  <button
    className={`
    flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded transition-all
    ${active ? "bg-surface text-primary shadow-sm" : "hover:bg-surface/50 text-text-muted hover:text-text-main"}
  `}
  >
    <span>{icon}</span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);
