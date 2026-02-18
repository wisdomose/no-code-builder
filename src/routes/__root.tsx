import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Antigravity - Pro Design Tool",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

import {
  Layers,
  Settings2,
  Layout as LayoutIcon,
  Play,
  Share2,
  MousePointer2,
  Type,
  Box,
  Undo2,
  Redo2,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
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
    elements,
  } = useEditorStore();

  const { leftWidth, rightWidth, isLeftCollapsed, isRightCollapsed } = layout;

  return (
    <html lang="en">
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
        <style>{`
          body { font-family: 'Inter', sans-serif; overflow: hidden; margin: 0; padding: 0; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          ::selection { background: rgba(0, 122, 255, 0.2); }
        `}</style>
      </head>
      <body className="antialiased text-[#1a1a1a] bg-[#f0f0f0]">
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Editor Header - Professional Tool Chrome */}
          <header className="h-10 border-b border-border flex items-center px-3 shrink-0 justify-between bg-card z-[100] select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-[13px] tracking-tight">
                <div className="w-5 h-5 bg-[#007aff] rounded flex items-center justify-center text-white">
                  <LayoutIcon size={12} />
                </div>
                <span>Antigravity</span>
              </div>
              <div className="h-4 w-[1px] bg-border mx-1" />
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <span>My Project</span>
                <span className="opacity-40">/</span>
                <span className="text-foreground">Index.html</span>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="flex items-center bg-muted/20 border border-border rounded-lg p-0.5 shadow-sm">
                <button className="p-1.5 hover:bg-card rounded-md transition-all text-muted-foreground hover:text-foreground">
                  <MousePointer2 size={14} />
                </button>
                <button className="p-1.5 hover:bg-card rounded-md transition-all text-muted-foreground hover:text-foreground">
                  <Type size={14} />
                </button>
                <button className="p-1.5 hover:bg-card rounded-md transition-all text-muted-foreground hover:text-foreground">
                  <Box size={14} />
                </button>
              </div>

              <div className="flex items-center bg-muted/20 border border-border rounded-lg p-0.5 shadow-sm">
                <button
                  onClick={() => useEditorStore.getState().undo()}
                  className="p-1.5 hover:bg-card rounded-md transition-all text-muted-foreground hover:text-foreground"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={14} />
                </button>
                <button
                  onClick={() => useEditorStore.getState().redo()}
                  className="p-1.5 hover:bg-card rounded-md transition-all text-muted-foreground hover:text-foreground"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border rounded-md">
                <Share2 size={13} />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1 bg-[#007aff] text-white text-[11px] font-bold rounded-md hover:bg-[#0066d6] transition-all shadow-[0_1px_2px_rgba(0,122,255,0.2)]">
                <Play size={11} fill="currentColor" />
                <span>Preview</span>
              </button>
            </div>
          </header>

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
            <div className="relative group h-full z-[80]">
              <Sidebar
                position="left"
                title="Navigator"
                icon={<Layers size={14} />}
                width={leftWidth}
                isCollapsed={isLeftCollapsed}
                onToggleCollapse={toggleLeftCollapse}
              >
                <LayerTree />
              </Sidebar>
              {!isLeftCollapsed && (
                <div className="absolute top-0 -right-0.5 bottom-0 z-[90]">
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
            <main className="h-full relative overflow-hidden flex flex-col bg-[#f0f0f0]">
              <Canvas>
                <Artboard />
              </Canvas>
            </main>

            {/* Right Sidebar - Design */}
            <div className="relative group h-full z-[80]">
              {!isRightCollapsed && (
                <div className="absolute top-0 -left-0.5 bottom-0 z-[90]">
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
                <PropertyInspector />
              </Sidebar>
            </div>
          </div>

          {/* Status Bar */}
          <footer className="h-6 border-t border-border bg-card flex items-center px-3 justify-between text-[10px] text-muted-foreground font-medium select-none z-[100]">
            <div className="flex gap-4">
              <span>View: Design</span>
              <span>Layers: {elements.length}</span>
            </div>
            <div className="flex gap-4 font-mono">
              <span>X: {Math.round(camera.x)}px</span>
              <span>Y: {Math.round(camera.y)}px</span>
              <span className="text-[#007aff]">
                {Math.round(camera.scale * 100)}%
              </span>
            </div>
          </footer>
        </div>

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
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
