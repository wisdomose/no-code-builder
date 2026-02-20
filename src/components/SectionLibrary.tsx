import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  LayoutGrid,
  Star,
  MessageSquare,
  Zap,
  Navigation,
  Search,
} from "lucide-react";
import { useEditorStore } from "@/lib/useEditorStore";
import {
  createHeroSection,
  createNavBar,
  createFeaturesSection,
  createBentoGrid,
  createTestimonialsSection,
  createPricingSection,
  createCtaBanner,
  createStatsSection,
  createTeamSection,
  createFaqSection,
  createFooter,
} from "@/lib/sectionTemplates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionDef {
  name: string;
  description: string;
  preview: React.ReactNode;
  factory: () => void;
}

interface CategoryDef {
  title: string;
  icon: React.ReactNode;
  sections: SectionDef[];
}

// ─── Mini Previews ────────────────────────────────────────────────────────────

function NavPreview() {
  return (
    <div className="w-full h-8 bg-background/60 border border-border/30 rounded-lg flex items-center justify-between px-3 gap-2">
      <div className="w-8 h-2 bg-primary/60 rounded-full" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-5 h-1.5 bg-text-muted/30 rounded-full" />
        ))}
      </div>
      <div className="w-10 h-4 bg-primary/20 border border-primary/40 rounded" />
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="w-full aspect-video bg-background/50 rounded p-3 flex flex-col items-center justify-center gap-2 border border-border/30">
      <div className="w-24 h-1.5 bg-primary/40 rounded-full" />
      <div className="w-full h-2.5 bg-text-muted/20 rounded-full" />
      <div className="w-3/4 h-2 bg-text-muted/15 rounded-full" />
      <div className="w-2/3 h-1.5 bg-text-muted/10 rounded-full" />
      <div className="flex gap-2 mt-1">
        <div className="w-14 h-4 bg-primary/30 border border-primary/30 rounded" />
        <div className="w-12 h-4 bg-text-muted/15 border border-border/30 rounded" />
      </div>
    </div>
  );
}

function FeaturesPreview() {
  return (
    <div className="w-full aspect-[16/8] grid grid-cols-3 grid-rows-2 gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded border border-border/40 p-1.5 flex flex-col gap-1"
        >
          <div className="w-3 h-3 rounded-full bg-primary/30" />
          <div className="w-full h-1 bg-text-muted/25 rounded-full" />
          <div className="w-3/4 h-1 bg-text-muted/15 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function BentoPreview() {
  return (
    <div className="w-full aspect-[16/10] grid grid-cols-5 grid-rows-4 gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      <div className="col-span-3 row-span-2 bg-primary/20 rounded border border-primary/20" />
      <div className="col-span-2 row-span-2 bg-surface rounded border border-border/40" />
      <div className="col-span-2 row-span-2 bg-surface rounded border border-border/40" />
      <div className="col-span-3 row-span-2 bg-amber-500/20 rounded border border-amber-400/20" />
    </div>
  );
}

function TestimonialsPreview() {
  return (
    <div className="w-full aspect-[16/7] flex gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-1 bg-surface rounded-md border border-border/40 p-1.5 flex flex-col gap-1"
        >
          <div className="w-full h-1 bg-text-muted/20 rounded-full" />
          <div className="w-full h-1 bg-text-muted/15 rounded-full" />
          <div className="w-2/3 h-1 bg-text-muted/10 rounded-full" />
          <div className="mt-auto flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-primary/30 shrink-0" />
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="w-full h-1 bg-text-muted/25 rounded-full" />
              <div className="w-2/3 h-1 bg-text-muted/15 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PricingPreview() {
  return (
    <div className="w-full aspect-[16/9] flex gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg items-start">
      {[false, true, false].map((active, i) => (
        <div
          key={i}
          className={`flex-1 rounded-md border p-1.5 flex flex-col gap-1 ${
            active
              ? "bg-primary/20 border-primary/40"
              : "bg-surface border-border/40"
          }`}
        >
          <div className="w-2/3 h-1 bg-text-muted/30 rounded-full" />
          <div className="w-full h-2 bg-text-muted/20 rounded-full" />
          <div className="mt-1 space-y-0.5">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="w-full h-1 bg-text-muted/15 rounded-full"
              />
            ))}
          </div>
          <div
            className={`mt-auto h-3 rounded ${active ? "bg-primary/40" : "bg-text-muted/15"}`}
          />
        </div>
      ))}
    </div>
  );
}

function CtaPreview() {
  return (
    <div className="w-full aspect-[16/6] bg-primary/20 border border-primary/30 rounded-lg p-3 flex flex-col items-center justify-center gap-1.5">
      <div className="w-2/3 h-2 bg-text-muted/30 rounded-full" />
      <div className="w-1/2 h-1.5 bg-text-muted/20 rounded-full" />
      <div className="flex gap-1.5 mt-1">
        <div className="w-12 h-3 bg-primary/40 rounded" />
        <div className="w-10 h-3 bg-text-muted/15 rounded" />
      </div>
    </div>
  );
}

function StatsPreview() {
  return (
    <div className="w-full h-10 bg-background/50 border border-border/30 rounded-lg flex items-center justify-around px-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="w-8 h-2 bg-primary/40 rounded-full" />
          <div className="w-6 h-1.5 bg-text-muted/20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function TeamPreview() {
  const colors = [
    "bg-primary/40",
    "bg-rose-500/40",
    "bg-emerald-500/40",
    "bg-amber-500/40",
  ];
  return (
    <div className="w-full aspect-[16/7] flex gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {colors.map((c, i) => (
        <div
          key={i}
          className="flex-1 bg-surface rounded-md border border-border/40 p-2 flex flex-col items-center gap-1.5"
        >
          <div className={`w-6 h-6 rounded-full ${c}`} />
          <div className="w-full h-1 bg-text-muted/25 rounded-full" />
          <div className="w-3/4 h-1 bg-text-muted/15 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function FaqPreview() {
  return (
    <div className="w-full aspect-[16/9] flex flex-col gap-1.5 p-2 bg-background/50 border border-border/30 rounded-lg">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-surface rounded border border-border/40 px-2 py-1.5 flex items-center justify-between gap-2"
        >
          <div className="flex-1 h-1.5 bg-text-muted/25 rounded-full" />
          <div className="w-1.5 h-1.5 border border-text-muted/30 rounded-[2px] shrink-0" />
        </div>
      ))}
    </div>
  );
}

function FooterPreview() {
  return (
    <div className="w-full aspect-[16/7] bg-[#0a0a0a]/80 border border-white/10 rounded-lg p-2 flex flex-col gap-1.5">
      <div className="flex gap-3 flex-1">
        <div className="flex flex-col gap-1 w-1/3">
          <div className="w-10 h-2 bg-white/40 rounded-full" />
          <div className="w-full h-1 bg-white/15 rounded-full" />
          <div className="w-3/4 h-1 bg-white/10 rounded-full" />
        </div>
        <div className="flex gap-4 flex-1">
          {[1, 2, 3].map((c) => (
            <div key={c} className="flex flex-col gap-1">
              <div className="w-8 h-1.5 bg-white/25 rounded-full" />
              {[1, 2, 3].map((l) => (
                <div key={l} className="w-6 h-1 bg-white/10 rounded-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="h-px bg-white/10" />
      <div className="flex justify-between">
        <div className="w-20 h-1 bg-white/15 rounded-full" />
        <div className="w-16 h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const SectionLibrary: React.FC = () => {
  const { addElements } = useEditorStore();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Structure",
    "Content",
    "Conversion",
  ]);
  const [query, setQuery] = useState("");

  const insertAt = (
    factory: (x: number, y: number) => ReturnType<typeof createHeroSection>,
  ) => {
    addElements(factory(300, 200));
  };

  const CATEGORIES: CategoryDef[] = useMemo(
    () => [
      {
        title: "Structure",
        icon: <Navigation size={12} />,
        sections: [
          {
            name: "Nav Bar",
            description: "Top navigation with logo, links & CTA",
            preview: <NavPreview />,
            factory: () => insertAt(createNavBar),
          },
          {
            name: "Footer",
            description: "Dark multi-column footer with links",
            preview: <FooterPreview />,
            factory: () => insertAt(createFooter),
          },
        ],
      },
      {
        title: "Hero",
        icon: <Star size={12} />,
        sections: [
          {
            name: "Visual Hero",
            description: "Centered headline, subtext & dual CTAs",
            preview: <HeroPreview />,
            factory: () => insertAt(createHeroSection),
          },
        ],
      },
      {
        title: "Content",
        icon: <LayoutGrid size={12} />,
        sections: [
          {
            name: "Features Grid",
            description: "3×2 grid of icon + text cards",
            preview: <FeaturesPreview />,
            factory: () => insertAt(createFeaturesSection),
          },
          {
            name: "Bento Grid",
            description: "Asymmetric mosaic cards layout",
            preview: <BentoPreview />,
            factory: () => insertAt(createBentoGrid),
          },
          {
            name: "Stats Bar",
            description: "4 key metrics in a horizontal strip",
            preview: <StatsPreview />,
            factory: () => insertAt(createStatsSection),
          },
          {
            name: "Team",
            description: "Avatar cards for each team member",
            preview: <TeamPreview />,
            factory: () => insertAt(createTeamSection),
          },
          {
            name: "FAQ",
            description: "Stacked question & answer panels",
            preview: <FaqPreview />,
            factory: () => insertAt(createFaqSection),
          },
        ],
      },
      {
        title: "Social Proof",
        icon: <MessageSquare size={12} />,
        sections: [
          {
            name: "Testimonials",
            description: "3-column customer quote cards",
            preview: <TestimonialsPreview />,
            factory: () => insertAt(createTestimonialsSection),
          },
        ],
      },
      {
        title: "Conversion",
        icon: <Zap size={12} />,
        sections: [
          {
            name: "Pricing",
            description: "3-tier pricing cards with features list",
            preview: <PricingPreview />,
            factory: () => insertAt(createPricingSection),
          },
          {
            name: "CTA Banner",
            description: "Full-width indigo banner with dual buttons",
            preview: <CtaPreview />,
            factory: () => insertAt(createCtaBanner),
          },
        ],
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    [addElements],
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      sections: cat.sections.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.sections.length > 0);
  }, [query, CATEGORIES]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search bar */}
      <div className="px-3 py-2.5 border-b border-border/50 shrink-0">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search sections…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background/50 border border-border/50 rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-text-main placeholder:text-text-muted focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 pt-12 px-4">
            <span className="text-3xl">🔍</span>
            <p className="text-[11px] text-text-muted text-center">
              No sections match{" "}
              <span className="text-text-main font-bold">"{query}"</span>
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <Category
              key={cat.title}
              title={cat.title}
              icon={cat.icon}
              isExpanded={
                expandedCategories.includes(cat.title) ||
                query.trim().length > 0
              }
              onToggle={() => toggleCategory(cat.title)}
            >
              <div className="grid grid-cols-1 gap-3 px-3">
                {cat.sections.map((section) => (
                  <PresetCard
                    key={section.name}
                    name={section.name}
                    description={section.description}
                    onClick={section.factory}
                  >
                    {section.preview}
                  </PresetCard>
                ))}
              </div>
            </Category>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Category ─────────────────────────────────────────────────────────────────

const Category: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, icon, children, isExpanded, onToggle }) => (
  <div className="group/cat border-b border-border/50 last:border-0">
    <div
      onClick={onToggle}
      className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-surface/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-text-muted group-hover/cat:text-text-main transition-colors">
          {icon}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted group-hover/cat:text-text-main transition-all">
          {title}
        </span>
      </div>
      <ChevronDown
        size={12}
        className={`text-text-muted group-hover/cat:text-text-main transition-all transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
      />
    </div>
    {isExpanded && (
      <div className="pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
        {children}
      </div>
    )}
  </div>
);

// ─── PresetCard ───────────────────────────────────────────────────────────────

const PresetCard: React.FC<{
  name: string;
  description: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ name, description, children, onClick }) => (
  <div
    onClick={onClick}
    className="relative group/preset rounded-xl border border-border bg-background/20 p-2 transition-all cursor-pointer hover:border-primary/50 hover:bg-surface/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] active:scale-[0.99]"
  >
    {/* Preview area */}
    <div className="overflow-hidden rounded-lg">{children}</div>

    {/* Footer */}
    <div className="mt-2 flex items-center justify-between px-0.5">
      <div>
        <p className="text-[11px] font-bold text-text-muted group-hover/preset:text-text-main transition-colors leading-none mb-0.5">
          {name}
        </p>
        <p className="text-[9px] text-text-muted/60 leading-none">
          {description}
        </p>
      </div>
      <span className="opacity-0 group-hover/preset:opacity-100 transition-opacity bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
        + Add
      </span>
    </div>
  </div>
);
