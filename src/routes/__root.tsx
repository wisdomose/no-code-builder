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
        title: "TanStack Start Starter",
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

import { Layers, Settings2, Layout as LayoutIcon } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { ResizeHandle } from "../components/ResizeHandle";
import { useEditorStore } from "../lib/useEditorStore";
import { Canvas } from "../components/Canvas";
import { Artboard } from "../components/Artboard";
import { LayerTree } from "../components/LayerTree";
import { PropertyInspector } from "../components/PropertyInspector";

function RootDocument() {
  const {
    layout,
    setLeftWidth,
    setRightWidth,
    toggleLeftCollapse,
    toggleRightCollapse,
  } = useEditorStore();

  const { leftWidth, rightWidth, isLeftCollapsed, isRightCollapsed } = layout;

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
          {/* Top Bar */}
          <header className="h-12 border-b border-border flex items-center px-4 shrink-0 justify-between bg-card z-50">
            <div className="flex items-center gap-2 font-bold text-lg">
              <LayoutIcon className="text-primary" size={20} />
              <span>No-Code Builder</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1 px-2 text-xs font-mono border border-border">
                <span className="text-muted-foreground">project:</span>
                <span className="text-primary">starter-app</span>
              </div>
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                Publish
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
            {/* Left Sidebar - Layers */}
            <div className="relative group h-full">
              <Sidebar
                position="left"
                title="Layers"
                icon={<Layers size={18} />}
                width={leftWidth}
                isCollapsed={isLeftCollapsed}
                onToggleCollapse={toggleLeftCollapse}
              >
                <LayerTree />
              </Sidebar>
              {!isLeftCollapsed && (
                <div className="absolute top-0 -right-0.5 bottom-0 z-50">
                  <ResizeHandle
                    position="right"
                    onResize={(delta) =>
                      setLeftWidth(
                        Math.min(420, Math.max(200, leftWidth + delta)),
                      )
                    }
                  />
                </div>
              )}
            </div>

            {/* Canvas Area */}
            <main className="h-full relative overflow-hidden flex flex-col">
              <Canvas>
                <Artboard />
              </Canvas>
            </main>

            {/* Right Sidebar - Inspector */}
            <div className="relative group h-full">
              {!isRightCollapsed && (
                <div className="absolute top-0 -left-0.5 bottom-0 z-50">
                  <ResizeHandle
                    position="left"
                    onResize={(delta) =>
                      setRightWidth(
                        Math.min(480, Math.max(260, rightWidth + delta)),
                      )
                    }
                  />
                </div>
              )}
              <Sidebar
                position="right"
                title="Inspector"
                icon={<Settings2 size={18} />}
                width={rightWidth}
                isCollapsed={isRightCollapsed}
                onToggleCollapse={toggleRightCollapse}
              >
                <PropertyInspector />
              </Sidebar>
            </div>
          </div>
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
