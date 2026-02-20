import type { EditorElement } from "./useEditorStore";

const id = () => Math.random().toString(36).substr(2, 9);

// ─── Palette helpers ──────────────────────────────────────────────────────────

const COLORS = {
    white: "#ffffff",
    black: "#0a0a0a",
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray400: "#9ca3af",
    gray600: "#4b5563",
    gray800: "#1f2937",
    indigo500: "#6366f1",
    indigo600: "#4f46e5",
    violet600: "#7c3aed",
    rose500: "#f43f5e",
    amber500: "#f59e0b",
    emerald500: "#10b981",
    sky500: "#0ea5e9",
} as const;

// shared shadow styles
const CARD_SHADOW = "0 4px 24px rgba(0,0,0,0.06)";
const DEEP_SHADOW = "0 20px 60px rgba(0,0,0,0.10)";

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

export const createHeroSection = (x: number, y: number): EditorElement[] => {
    const sid = `hero-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Hero",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.white,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                padding: 80,
                boxShadow: DEEP_SHADOW,
            },
        },
        {
            id: `${sid}-overline`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 1040, height: "auto",
                text: "✦ INTRODUCING THE FUTURE",
                color: COLORS.indigo600,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textAlign: "center",
            },
        },
        {
            id: `${sid}-title`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 1040, height: "auto",
                text: "Build anything, faster than ever before",
                color: COLORS.black,
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.1,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-desc`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 700, height: "auto",
                text: "The visual workspace that lets your whole team design, prototype, and ship — without writing a single line of code.",
                color: COLORS.gray600,
                fontSize: 18,
                lineHeight: 1.6,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-btns`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 0,
            },
        },
        {
            id: `${sid}-cta`,
            type: "button",
            parentId: `${sid}-btns`,
            props: {
                x: 0, y: 0, width: 180, height: 52,
                text: "Get started free →",
                background: COLORS.indigo600,
                color: COLORS.white,
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
            },
        },
        {
            id: `${sid}-demo`,
            type: "button",
            parentId: `${sid}-btns`,
            props: {
                x: 0, y: 0, width: 156, height: 52,
                text: "View demo ▶",
                background: COLORS.gray100,
                color: COLORS.gray800,
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
            },
        },
    ];
};

// ─── 2. Nav Bar ───────────────────────────────────────────────────────────────

export const createNavBar = (x: number, y: number): EditorElement[] => {
    const sid = `nav-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Nav Bar",
            props: {
                x, y, width: 1200, height: 64,
                background: "rgba(255,255,255,0.85)",
                borderRadius: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                borderWidth: 1,
                borderColor: COLORS.gray200,
                borderStyle: "solid",
            },
        },
        {
            id: `${sid}-logo`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "✦ Acme",
                color: COLORS.black,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.5px",
            },
        },
        {
            id: `${sid}-links`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 32,
                padding: 0,
            },
        },
        ...(["Product", "Pricing", "Docs", "Blog"] as const).map((label, i) => ({
            id: `${sid}-link-${i}`,
            type: "text" as const,
            parentId: `${sid}-links`,
            props: {
                x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                text: label,
                color: COLORS.gray600,
                fontSize: 14,
                fontWeight: 600,
            },
        })),
        {
            id: `${sid}-cta`,
            type: "button",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 120, height: 40,
                text: "Sign up",
                background: COLORS.indigo600,
                color: COLORS.white,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
            },
        },
    ];
};

// ─── 3. Features Grid ────────────────────────────────────────────────────────

const FEATURE_ITEMS = [
    { icon: "⚡", title: "Blazing Fast", desc: "Ship in seconds with instant hot-reload and optimized bundles." },
    { icon: "🎨", title: "Pixel Perfect", desc: "Every component is crafted with obsessive attention to detail." },
    { icon: "🔒", title: "Secure by Default", desc: "End-to-end encryption with zero-trust access controls built in." },
    { icon: "📡", title: "Real-Time Sync", desc: "Collaborate live across every device with conflict-free merging." },
    { icon: "🧩", title: "Composable", desc: "Mix and match building blocks to create any layout imaginable." },
    { icon: "🌍", title: "Global CDN", desc: "Hosted at the edge with < 50 ms response times worldwide." },
];

export const createFeaturesSection = (x: number, y: number): EditorElement[] => {
    const sid = `features-${id()}`;
    const cols = 3;
    const cardW = 360;
    const cardH = 200;
    const gap = 20;

    const children: EditorElement[] = FEATURE_ITEMS.map((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cid = `${sid}-card-${i}`;
        return [
            {
                id: cid,
                type: "container" as const,
                parentId: sid,
                props: {
                    x: col * (cardW + gap),
                    y: row * (cardH + gap),
                    width: cardW,
                    height: "auto" as const,
                    background: COLORS.white,
                    borderRadius: 20,
                    display: "flex" as const,
                    flexDirection: "column" as const,
                    gap: 12,
                    padding: 28,
                    boxShadow: CARD_SHADOW,
                    borderWidth: 1,
                    borderColor: COLORS.gray200,
                    borderStyle: "solid" as const,
                },
            },
            {
                id: `${cid}-icon`,
                type: "text" as const,
                parentId: cid,
                props: {
                    x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                    text: item.icon,
                    fontSize: 32,
                },
            },
            {
                id: `${cid}-title`,
                type: "text" as const,
                parentId: cid,
                props: {
                    x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                    text: item.title,
                    color: COLORS.black,
                    fontSize: 16,
                    fontWeight: 700,
                },
            },
            {
                id: `${cid}-desc`,
                type: "text" as const,
                parentId: cid,
                props: {
                    x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                    text: item.desc,
                    color: COLORS.gray600,
                    fontSize: 14,
                    lineHeight: 1.6,
                },
            },
        ];
    }).flat();

    return [
        {
            id: sid,
            type: "container",
            name: "Features",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.gray50,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                gap: 48,
                padding: 60,
            },
        },
        {
            id: `${sid}-header`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                padding: 0,
            },
        },
        {
            id: `${sid}-label`,
            type: "text",
            parentId: `${sid}-header`,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "FEATURES",
                color: COLORS.indigo600,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textAlign: "center",
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: `${sid}-header`,
            props: {
                x: 0, y: 0, width: 700, height: "auto",
                text: "Everything you need to ship faster",
                color: COLORS.black,
                fontSize: 40,
                fontWeight: 800,
                lineHeight: 1.2,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-grid`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap,
                padding: 0,
            },
        },
        ...children.map(el => ({ ...el, parentId: el.parentId === sid ? `${sid}-grid` : el.parentId })),
    ];
};

// ─── 4. Bento Grid ───────────────────────────────────────────────────────────

export const createBentoGrid = (x: number, y: number): EditorElement[] => {
    const sid = `bento-${id()}`;
    const gap = 16;
    const cardColors = [
        { bg: COLORS.indigo600, text: COLORS.white, label: "Analytics", desc: "Real-time dashboards and custom reports" },
        { bg: COLORS.white, text: COLORS.black, label: "Integrations", desc: "Connect 200+ tools in one click" },
        { bg: COLORS.amber500, text: COLORS.white, label: "Automation", desc: "Set it and forget it" },
        { bg: COLORS.white, text: COLORS.black, label: "Security", desc: "SOC 2 Type II certified" },
    ];

    const layout = [
        { width: 580, height: 300 },
        { width: 380, height: 300 },
        { width: 380, height: 280 },
        { width: 580, height: 280 },
    ];

    return [
        {
            id: sid,
            type: "container",
            name: "Bento Grid",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.gray50,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                gap: 48,
                padding: 60,
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "One platform, infinite possibilities",
                color: COLORS.black,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-grid`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap,
                padding: 0,
            },
        },
        ...cardColors.map((card, i) => {
            const cid = `${sid}-card-${i}`;
            return [
                {
                    id: cid,
                    type: "container" as const,
                    parentId: `${sid}-grid`,
                    props: {
                        x: 0, y: 0,
                        width: layout[i].width,
                        height: layout[i].height,
                        background: card.bg,
                        borderRadius: 20,
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        justifyContent: "end" as any,
                        gap: 8,
                        padding: 32,
                        boxShadow: CARD_SHADOW,
                    },
                },
                {
                    id: `${cid}-label`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: card.label,
                        color: card.text,
                        fontSize: 22,
                        fontWeight: 800,
                    },
                },
                {
                    id: `${cid}-desc`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: card.desc,
                        color: card.text === COLORS.white ? "rgba(255,255,255,0.7)" : COLORS.gray600,
                        fontSize: 14,
                    },
                },
            ];
        }).flat(),
    ];
};

// ─── 5. Testimonials ─────────────────────────────────────────────────────────

const TESTIMONIALS = [
    { quote: "This is genuinely the best product we've used this decade. We cut our design cycle in half.", name: "Sarah Chen", role: "Head of Design @ Vercel", avatar: "SC" },
    { quote: "I've tried everything. Nothing comes close. Our team adopted it in an afternoon.", name: "Marcus Rivera", role: "CTO @ Linear", avatar: "MR" },
    { quote: "The attention to detail is unreal. Feels like it was built for exactly how we work.", name: "Aya Nakamura", role: "Product Lead @ Notion", avatar: "AN" },
];

export const createTestimonialsSection = (x: number, y: number): EditorElement[] => {
    const sid = `testimonials-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Testimonials",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.white,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                gap: 48,
                padding: 80,
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "Loved by the best teams",
                color: COLORS.black,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-row`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 20,
                padding: 0,
            },
        },
        ...TESTIMONIALS.map((t, i) => {
            const cid = `${sid}-card-${i}`;
            return [
                {
                    id: cid,
                    type: "container" as const,
                    parentId: `${sid}-row`,
                    props: {
                        x: 0, y: 0, width: 340, height: "auto" as const,
                        background: COLORS.gray50,
                        borderRadius: 20,
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        gap: 20,
                        padding: 28,
                        borderWidth: 1,
                        borderColor: COLORS.gray200,
                        borderStyle: "solid" as const,
                    },
                },
                {
                    id: `${cid}-quote`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: `"${t.quote}"`,
                        color: COLORS.gray800,
                        fontSize: 15,
                        lineHeight: 1.65,
                        fontStyle: "italic" as const,
                    },
                },
                {
                    id: `${cid}-author`,
                    type: "container" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        background: "transparent",
                        display: "flex" as const,
                        flexDirection: "row" as const,
                        alignItems: "center" as const,
                        gap: 12,
                        padding: 0,
                    },
                },
                {
                    id: `${cid}-avatar`,
                    type: "container" as const,
                    parentId: `${cid}-author`,
                    props: {
                        x: 0, y: 0, width: 40, height: 40,
                        background: COLORS.indigo500,
                        borderRadius: 20,
                        display: "flex" as const,
                        alignItems: "center" as const,
                        justifyContent: "center" as const,
                        padding: 0,
                    },
                },
                {
                    id: `${cid}-initials`,
                    type: "text" as const,
                    parentId: `${cid}-avatar`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: t.avatar,
                        color: COLORS.white,
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "center" as const,
                    },
                },
                {
                    id: `${cid}-meta`,
                    type: "container" as const,
                    parentId: `${cid}-author`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        background: "transparent",
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        gap: 2,
                        padding: 0,
                    },
                },
                {
                    id: `${cid}-name`,
                    type: "text" as const,
                    parentId: `${cid}-meta`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: t.name,
                        color: COLORS.black,
                        fontSize: 13,
                        fontWeight: 700,
                    },
                },
                {
                    id: `${cid}-role`,
                    type: "text" as const,
                    parentId: `${cid}-meta`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: t.role,
                        color: COLORS.gray400,
                        fontSize: 12,
                    },
                },
            ];
        }).flat(),
    ];
};

// ─── 6. Pricing ───────────────────────────────────────────────────────────────

const PLANS = [
    {
        name: "Starter", price: "$0", per: "/ month", cta: "Start free",
        features: ["Up to 3 projects", "5 GB storage", "Community support", "Basic analytics"],
        accent: COLORS.gray800, bg: COLORS.white, ctaBg: COLORS.gray100, ctaColor: COLORS.gray800,
    },
    {
        name: "Pro", price: "$29", per: "/ month", cta: "Get Pro →", badge: "Most Popular",
        features: ["Unlimited projects", "100 GB storage", "Priority support", "Advanced analytics", "Team collaboration"],
        accent: COLORS.indigo600, bg: COLORS.indigo600, ctaBg: COLORS.white, ctaColor: COLORS.indigo600,
    },
    {
        name: "Enterprise", price: "$99", per: "/ month", cta: "Contact sales",
        features: ["Everything in Pro", "500 GB storage", "Dedicated SLA", "Custom integrations", "SSO & SCIM"],
        accent: COLORS.black, bg: COLORS.white, ctaBg: COLORS.black, ctaColor: COLORS.white,
    },
];

export const createPricingSection = (x: number, y: number): EditorElement[] => {
    const sid = `pricing-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Pricing",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.gray50,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 48,
                padding: 80,
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "Simple, transparent pricing",
                color: COLORS.black,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-sub`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 500, height: "auto",
                text: "No hidden fees. No credit card required. Upgrade anytime.",
                color: COLORS.gray600,
                fontSize: 16,
                textAlign: "center",
                lineHeight: 1.5,
            },
        },
        {
            id: `${sid}-row`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                alignItems: "start" as any,
                gap: 16,
                padding: 0,
            },
        },
        ...PLANS.map((plan, i) => {
            const cid = `${sid}-plan-${i}`;
            const isPro = plan.name === "Pro";
            return [
                {
                    id: cid,
                    type: "container" as const,
                    parentId: `${sid}-row`,
                    props: {
                        x: 0, y: 0, width: 320, height: "auto" as const,
                        background: plan.bg,
                        borderRadius: 24,
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        gap: 20,
                        padding: 32,
                        boxShadow: isPro ? "0 8px 40px rgba(79,70,229,0.35)" : CARD_SHADOW,
                        borderWidth: isPro ? 0 : 1,
                        borderColor: COLORS.gray200,
                        borderStyle: "solid" as const,
                    },
                },
                ...(plan.badge ? [{
                    id: `${cid}-badge`,
                    type: "container" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 100,
                        padding: "4px 12px",
                        display: "flex" as const,
                        alignItems: "center" as const,
                        justifyContent: "center" as const,
                    },
                }, {
                    id: `${cid}-badge-text`,
                    type: "text" as const,
                    parentId: `${cid}-badge`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: plan.badge!,
                        color: COLORS.white,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                    },
                }] : []),
                {
                    id: `${cid}-name`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: plan.name,
                        color: isPro ? COLORS.white : COLORS.gray600,
                        fontSize: 14,
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.08em",
                    },
                },
                {
                    id: `${cid}-price`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: `${plan.price} ${plan.per}`,
                        color: isPro ? COLORS.white : COLORS.black,
                        fontSize: 36,
                        fontWeight: 800,
                    },
                },
                {
                    id: `${cid}-divider`,
                    type: "container" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: 1,
                        background: isPro ? "rgba(255,255,255,0.15)" : COLORS.gray200,
                        borderRadius: 1,
                        padding: 0,
                    },
                },
                ...plan.features.map((f, fi) => ({
                    id: `${cid}-feat-${fi}`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: `✓  ${f}`,
                        color: isPro ? "rgba(255,255,255,0.85)" : COLORS.gray600,
                        fontSize: 14,
                        lineHeight: 1.5,
                    },
                })),
                {
                    id: `${cid}-cta`,
                    type: "button" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: 48,
                        text: plan.cta,
                        background: plan.ctaBg,
                        color: plan.ctaColor,
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        boxShadow: isPro ? "none" : undefined,
                    },
                },
            ];
        }).flat(),
    ];
};

// ─── 7. CTA Banner ───────────────────────────────────────────────────────────

export const createCtaBanner = (x: number, y: number): EditorElement[] => {
    const sid = `cta-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "CTA Banner",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.indigo600,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                padding: 80,
                boxShadow: "0 16px 60px rgba(79,70,229,0.35)",
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 700, height: "auto",
                text: "Ready to build something amazing?",
                color: COLORS.white,
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.15,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-sub`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 500, height: "auto",
                text: "Join 40,000+ teams already building with our platform. Free to start, forever.",
                color: "rgba(255,255,255,0.75)",
                fontSize: 16,
                textAlign: "center",
                lineHeight: 1.5,
            },
        },
        {
            id: `${sid}-btns`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 0,
            },
        },
        {
            id: `${sid}-cta`,
            type: "button",
            parentId: `${sid}-btns`,
            props: {
                x: 0, y: 0, width: 180, height: 52,
                text: "Start building free",
                background: COLORS.white,
                color: COLORS.indigo600,
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
            },
        },
        {
            id: `${sid}-demo`,
            type: "button",
            parentId: `${sid}-btns`,
            props: {
                x: 0, y: 0, width: 160, height: 52,
                text: "Book a demo",
                background: "rgba(255,255,255,0.12)",
                color: COLORS.white,
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
                borderStyle: "solid",
            },
        },
    ];
};

// ─── 8. Stats / Metrics ──────────────────────────────────────────────────────

const STATS = [
    { value: "40K+", label: "Teams worldwide" },
    { value: "2.4M", label: "Projects shipped" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "< 50ms", label: "Global latency" },
];

export const createStatsSection = (x: number, y: number): EditorElement[] => {
    const sid = `stats-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Stats",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.white,
                borderRadius: 24,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "48px 80px",
                boxShadow: CARD_SHADOW,
                borderWidth: 1,
                borderColor: COLORS.gray200,
                borderStyle: "solid",
            },
        },
        ...STATS.map((s, i) => {
            const cid = `${sid}-stat-${i}`;
            return [
                {
                    id: cid,
                    type: "container" as const,
                    parentId: sid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        background: "transparent",
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        alignItems: "center" as const,
                        gap: 6,
                        padding: 0,
                    },
                },
                {
                    id: `${cid}-value`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: s.value,
                        color: COLORS.indigo600,
                        fontSize: 40,
                        fontWeight: 800,
                        textAlign: "center" as const,
                    },
                },
                {
                    id: `${cid}-label`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: s.label,
                        color: COLORS.gray600,
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "center" as const,
                    },
                },
            ];
        }).flat(),
    ];
};

// ─── 9. Team ─────────────────────────────────────────────────────────────────

const TEAM = [
    { name: "Alex Morgan", role: "CEO & Co-Founder", initials: "AM", color: COLORS.indigo500 },
    { name: "Jordan Kim", role: "CTO & Co-Founder", initials: "JK", color: COLORS.rose500 },
    { name: "Sam Rivera", role: "Head of Design", initials: "SR", color: COLORS.emerald500 },
    { name: "Taylor Stone", role: "Head of Growth", initials: "TS", color: COLORS.amber500 },
];

export const createTeamSection = (x: number, y: number): EditorElement[] => {
    const sid = `team-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Team",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.white,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 48,
                padding: 80,
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "Meet the team",
                color: COLORS.black,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-row`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 20,
                padding: 0,
            },
        },
        ...TEAM.map((member, i) => {
            const cid = `${sid}-member-${i}`;
            return [
                {
                    id: cid,
                    type: "container" as const,
                    parentId: `${sid}-row`,
                    props: {
                        x: 0, y: 0, width: 240, height: "auto" as const,
                        background: COLORS.gray50,
                        borderRadius: 20,
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        alignItems: "center" as const,
                        gap: 12,
                        padding: 28,
                        borderWidth: 1,
                        borderColor: COLORS.gray200,
                        borderStyle: "solid" as const,
                    },
                },
                {
                    id: `${cid}-avatar`,
                    type: "container" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: 72, height: 72,
                        background: member.color,
                        borderRadius: 36,
                        display: "flex" as const,
                        alignItems: "center" as const,
                        justifyContent: "center" as const,
                        padding: 0,
                    },
                },
                {
                    id: `${cid}-initials`,
                    type: "text" as const,
                    parentId: `${cid}-avatar`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: member.initials,
                        color: COLORS.white,
                        fontSize: 20,
                        fontWeight: 800,
                        textAlign: "center" as const,
                    },
                },
                {
                    id: `${cid}-name`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: member.name,
                        color: COLORS.black,
                        fontSize: 15,
                        fontWeight: 700,
                        textAlign: "center" as const,
                    },
                },
                {
                    id: `${cid}-role`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: member.role,
                        color: COLORS.gray400,
                        fontSize: 13,
                        textAlign: "center" as const,
                    },
                },
            ];
        }).flat(),
    ];
};

// ─── 10. FAQ ──────────────────────────────────────────────────────────────────

const FAQS = [
    { q: "Is there a free plan?", a: "Yes! Our Starter plan is free forever with no credit card required. You get access to up to 3 projects and 5 GB of storage." },
    { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time from your account settings. No questions asked." },
    { q: "Do you offer a student discount?", a: "We offer 50% off for students and educators. Reach out with your institutional email to claim it." },
    { q: "Is my data secure?", a: "We're SOC 2 Type II certified. All data is encrypted at rest (AES-256) and in transit (TLS 1.3)." },
];

export const createFaqSection = (x: number, y: number): EditorElement[] => {
    const sid = `faq-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "FAQ",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.white,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 48,
                padding: 80,
            },
        },
        {
            id: `${sid}-heading`,
            type: "text",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "Frequently asked questions",
                color: COLORS.black,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
            },
        },
        {
            id: `${sid}-list`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: 800, height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 0,
            },
        },
        ...FAQS.map((faq, i) => {
            const cid = `${sid}-faq-${i}`;
            return [
                {
                    id: cid,
                    type: "container" as const,
                    parentId: `${sid}-list`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        background: COLORS.gray50,
                        borderRadius: 16,
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        gap: 10,
                        padding: 24,
                        borderWidth: 1,
                        borderColor: COLORS.gray200,
                        borderStyle: "solid" as const,
                    },
                },
                {
                    id: `${cid}-q`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: faq.q,
                        color: COLORS.black,
                        fontSize: 16,
                        fontWeight: 700,
                    },
                },
                {
                    id: `${cid}-a`,
                    type: "text" as const,
                    parentId: cid,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: faq.a,
                        color: COLORS.gray600,
                        fontSize: 14,
                        lineHeight: 1.65,
                    },
                },
            ];
        }).flat(),
    ];
};

// ─── 11. Footer ───────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
    { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
    { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { heading: "Legal", links: ["Privacy", "Terms", "Cookies", "Security"] },
];

export const createFooter = (x: number, y: number): EditorElement[] => {
    const sid = `footer-${id()}`;
    return [
        {
            id: sid,
            type: "container",
            name: "Footer",
            props: {
                x, y, width: 1200, height: "auto",
                background: COLORS.black,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                gap: 48,
                padding: 60,
            },
        },
        {
            id: `${sid}-top`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 60,
                padding: 0,
            },
        },
        {
            id: `${sid}-brand`,
            type: "container",
            parentId: `${sid}-top`,
            props: {
                x: 0, y: 0, width: 280, height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 0,
            },
        },
        {
            id: `${sid}-logo`,
            type: "text",
            parentId: `${sid}-brand`,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "✦ Acme",
                color: COLORS.white,
                fontSize: 22,
                fontWeight: 800,
            },
        },
        {
            id: `${sid}-tagline`,
            type: "text",
            parentId: `${sid}-brand`,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "The visual platform for modern teams. Design, build, and ship without code.",
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
                lineHeight: 1.6,
            },
        },
        {
            id: `${sid}-cols`,
            type: "container",
            parentId: `${sid}-top`,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: 60,
                padding: 0,
            },
        },
        ...FOOTER_LINKS.map((col, ci) => {
            const colId = `${sid}-col-${ci}`;
            return [
                {
                    id: colId,
                    type: "container" as const,
                    parentId: `${sid}-cols`,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        background: "transparent",
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        gap: 16,
                        padding: 0,
                    },
                },
                {
                    id: `${colId}-heading`,
                    type: "text" as const,
                    parentId: colId,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: col.heading,
                        color: COLORS.white,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                    },
                },
                ...col.links.map((link, li) => ({
                    id: `${colId}-link-${li}`,
                    type: "text" as const,
                    parentId: colId,
                    props: {
                        x: 0, y: 0, width: "auto" as const, height: "auto" as const,
                        text: link,
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 14,
                    },
                })),
            ];
        }).flat(),
        {
            id: `${sid}-divider`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: 1,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 1,
                padding: 0,
            },
        },
        {
            id: `${sid}-bottom`,
            type: "container",
            parentId: sid,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 0,
            },
        },
        {
            id: `${sid}-copy`,
            type: "text",
            parentId: `${sid}-bottom`,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "© 2025 Acme Inc. All rights reserved.",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
            },
        },
        {
            id: `${sid}-social`,
            type: "text",
            parentId: `${sid}-bottom`,
            props: {
                x: 0, y: 0, width: "auto", height: "auto",
                text: "Twitter  ·  GitHub  ·  LinkedIn",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
            },
        },
    ];
};
