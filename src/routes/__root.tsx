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

import { Layers, Settings2, Maximize, Box, Database } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ToolBar } from "@/components/ToolBar";
import { ResizeHandle } from "@/components/ResizeHandle";
import { useEditorStore } from "@/lib/useEditorStore";
import { Canvas } from "@/components/Canvas";
import { Artboard } from "@/components/Artboard";
import { LayerTree } from "@/components/LayerTree";
import { PropertyInspector } from "@/components/PropertyInspector";
import { Header } from "@/components/Header";
import { StatusBar } from "@/components/StatusBar";
import { SectionLibrary } from "@/components/SectionLibrary";

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
    leftSidebarTab,
    setLeftSidebarTab,
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
          <Header />

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
                  title={
                    leftSidebarTab.charAt(0).toUpperCase() +
                    leftSidebarTab.slice(1)
                  }
                  icon={
                    leftSidebarTab === "layers" ? (
                      <Layers size={14} />
                    ) : leftSidebarTab === "assets" ? (
                      <Box size={14} />
                    ) : (
                      <Database size={14} />
                    )
                  }
                  width={leftWidth}
                  isCollapsed={isLeftCollapsed}
                  onToggleCollapse={toggleLeftCollapse}
                >
                  <div className="p-1 border-b border-border flex gap-1 bg-background/30 mx-2 mt-2 rounded">
                    <SidebarTab
                      label="Layers"
                      active={leftSidebarTab === "layers"}
                      icon={<Layers size={11} />}
                      onClick={() => setLeftSidebarTab("layers")}
                    />
                    <SidebarTab
                      label="Assets"
                      active={leftSidebarTab === "assets"}
                      icon={<Box size={11} />}
                      onClick={() => setLeftSidebarTab("assets")}
                    />
                    <SidebarTab
                      label="Sections"
                      active={leftSidebarTab === "sections"}
                      icon={<Database size={11} />}
                      onClick={() => setLeftSidebarTab("sections")}
                    />
                  </div>
                  {leftSidebarTab === "layers" && <LayerTree />}
                  {leftSidebarTab === "sections" && <SectionLibrary />}
                  {leftSidebarTab === "assets" && (
                    <div className="p-4 text-center text-[11px] text-text-muted italic">
                      Coming soon...
                    </div>
                  )}
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

          <StatusBar />
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
  onClick,
}: {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
    flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded transition-all
    ${active ? "bg-surface text-primary shadow-sm" : "hover:bg-surface/50 text-text-muted hover:text-text-main"}
  `}
  >
    <span>{icon}</span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);
