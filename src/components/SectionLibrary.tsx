import React, { useState } from "react";
import { ChevronDown, Database, LayoutGrid, Type } from "lucide-react";
import { useEditorStore } from "@/lib/useEditorStore";
import { createHeroSection, createBentoGrid } from "@/lib/sectionTemplates";

export const SectionLibrary: React.FC = () => {
  const { addElements } = useEditorStore();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Hero Sections",
    "Bento Grids",
  ]);

  const handleAddHero = () => {
    // Center-ish insertion
    const elements = createHeroSection(300, 200);
    addElements(elements);
  };

  const handleAddBento = () => {
    const elements = createBentoGrid(300, 200);
    addElements(elements);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
      <Category
        title="Hero Sections"
        icon={<Type size={12} />}
        isExpanded={expandedCategories.includes("Hero Sections")}
        onToggle={() => toggleCategory("Hero Sections")}
      >
        <div className="grid grid-cols-1 gap-3 px-3">
          <PresetCard name="Visual Hero" onClick={handleAddHero}>
            <div className="w-full aspect-video bg-background/50 rounded p-4 flex flex-col items-center justify-center gap-2 border border-border/50">
              <div className="w-full h-2 bg-text-muted/20 rounded-full" />
              <div className="w-2/3 h-1.5 bg-text-muted/10 rounded-full" />
              <div className="mt-2 w-16 h-4 bg-primary/20 border border-primary/30 rounded" />
            </div>
          </PresetCard>
        </div>
      </Category>

      <Category
        title="Bento Grids"
        icon={<LayoutGrid size={12} />}
        isExpanded={expandedCategories.includes("Bento Grids")}
        onToggle={() => toggleCategory("Bento Grids")}
        active
      >
        <div className="grid grid-cols-1 gap-4 px-3">
          <PresetCard name="2x2 Classic" badge="2x2" onClick={handleAddBento}>
            <div className="aspect-[16/10] grid grid-cols-2 grid-rows-2 gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg group-hover/preset:border-primary/50 transition-colors">
              <div className="bg-surface rounded-md border border-border/50 shadow-inner" />
              <div className="bg-surface rounded-md border border-border/50 shadow-inner" />
              <div className="bg-surface rounded-md border border-border/50 shadow-inner" />
              <div className="bg-surface rounded-md border border-border/50 shadow-inner" />
            </div>
          </PresetCard>

          <PresetCard name="Mixed Mosaic">
            <div className="aspect-[16/10] grid grid-cols-3 grid-rows-2 gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
              <div className="bg-surface rounded-md border border-border/50 shadow-inner col-span-2" />
              <div className="bg-surface rounded-md border border-border/50 shadow-inner" />
              <div className="bg-surface rounded-md border border-border/50 shadow-inner" />
              <div className="bg-surface rounded-md border border-border/50 shadow-inner col-span-2" />
            </div>
          </PresetCard>

          <PresetCard name="Dense 4x3">
            <div className="aspect-[16/10] grid grid-cols-4 grid-rows-3 gap-1 p-2 bg-background/50 border border-border/30 rounded-lg">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface rounded border border-border/30 shadow-inner"
                />
              ))}
            </div>
          </PresetCard>
        </div>
      </Category>

      <Category
        title="Features"
        icon={<Database size={12} />}
        isExpanded={expandedCategories.includes("Features")}
        onToggle={() => toggleCategory("Features")}
      >
        <div className="px-3 pb-4">
          <p className="text-[10px] text-text-muted italic">
            More coming soon...
          </p>
        </div>
      </Category>

      <Category
        title="Footers"
        icon={<LayoutGrid size={12} />}
        isExpanded={expandedCategories.includes("Footers")}
        onToggle={() => toggleCategory("Footers")}
      >
        <div className="px-3 pb-4">
          <p className="text-[10px] text-text-muted italic">
            More coming soon...
          </p>
        </div>
      </Category>
    </div>
  );
};

const Category: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  active?: boolean;
}> = ({ title, icon, children, isExpanded, onToggle, active }) => (
  <div className="group/cat border-b border-border/50 last:border-0">
    <div
      onClick={onToggle}
      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span
          className={`${active ? "text-primary" : "text-text-muted"} group-hover/cat:text-text-main transition-colors`}
        >
          {icon}
        </span>
        <span
          className={`text-[11px] font-bold uppercase tracking-wider ${active ? "text-text-main" : "text-text-muted"} group-hover/cat:text-text-main transition-all`}
        >
          {title}
        </span>
      </div>
      <ChevronDown
        size={12}
        className={`text-text-muted group-hover/cat:text-text-main transition-all transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
      />
    </div>
    {isExpanded && (
      <div className="pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
        {children}
      </div>
    )}
  </div>
);

const PresetCard: React.FC<{
  name: string;
  children: React.ReactNode;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}> = ({ name, children, active, badge, onClick }) => (
  <div
    onClick={onClick}
    className={`
        relative group/preset rounded-xl border p-2 transition-all cursor-pointer
        ${active ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]" : "bg-background/20 border-border hover:border-primary/50 hover:bg-surface/30"}
    `}
  >
    {children}
    <div className="mt-2 flex items-center justify-between">
      <span
        className={`text-[10px] font-bold tracking-tight ${active ? "text-primary" : "text-text-muted group-hover/preset:text-text-main"}`}
      >
        {name}
      </span>
      {badge && (
        <span className="bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
          {badge}
        </span>
      )}
    </div>
  </div>
);
