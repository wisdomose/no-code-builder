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

import { NavPreview } from "./previews/NavPreview";
import { HeroPreview } from "./previews/HeroPreview";
import { FeaturesPreview } from "./previews/FeaturesPreview";
import { BentoPreview } from "./previews/BentoPreview";
import { TestimonialsPreview } from "./previews/TestimonialsPreview";
import { PricingPreview } from "./previews/PricingPreview";
import { CtaPreview } from "./previews/CtaPreview";
import { StatsPreview } from "./previews/StatsPreview";
import { TeamPreview } from "./previews/TeamPreview";
import { FaqPreview } from "./previews/FaqPreview";
import { FooterPreview } from "./previews/FooterPreview";

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
