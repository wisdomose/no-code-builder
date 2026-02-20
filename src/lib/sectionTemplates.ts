import type { EditorElement } from "./useEditorStore";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createHeroSection = (x: number, y: number): EditorElement[] => {
    const sectionId = `hero-${generateId()}`;
    return [
        {
            id: sectionId,
            type: 'container',
            props: {
                x, y, width: 800, height: "auto",
                background: '#ffffff',
                borderRadius: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                padding: 40,
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
            }
        },
        {
            id: `${sectionId}-title`,
            type: 'text',
            parentId: sectionId,
            props: {
                x: x + 100, y: y + 100, width: 600, height: 60,
                text: 'Modern Recovery Dashboard',
                color: '#111827',
                fontSize: 48,
                fontWeight: 800,
                textAlign: 'center'
            }
        },
        {
            id: `${sectionId}-desc`,
            type: 'text',
            parentId: sectionId,
            props: {
                x: x + 150, y: y + 180, width: 500, height: 40,
                text: 'Track every dollar saved with our automated recovery workflows.',
                color: '#6b7280',
                fontSize: 16,
                textAlign: 'center'
            }
        },
        {
            id: `${sectionId}-button`,
            type: 'button',
            parentId: sectionId,
            props: {
                x: x + 320, y: y + 260, width: 160, height: 48,
                text: 'Get Started',
                background: '#4f46e5',
                color: '#ffffff',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600
            }
        }
    ];
};

export const createBentoGrid = (x: number, y: number): EditorElement[] => {
    const sectionId = `bento-${generateId()}`;
    const gap = 20;
    const itemW = 280;
    const itemH = 200;

    const items = [
        { dx: 0, dy: 0 },
        { dx: itemW + gap, dy: 0 },
        { dx: 0, dy: itemH + gap },
        { dx: itemW + gap, dy: itemH + gap }
    ];

    return [
        {
            id: sectionId,
            type: 'container',
            props: {
                x, y, width: (itemW * 2) + gap + 40, height: "auto",
                background: 'transparent',
                display: 'flex',
                gap: gap,
                padding: 20
            }
        },
        ...items.map((item, i) => ({
            id: `${sectionId}-item-${i}`,
            type: 'container' as const,
            parentId: sectionId,
            props: {
                x: x + 20 + item.dx,
                y: y + 20 + item.dy,
                width: itemW,
                height: itemH,
                background: '#ffffff',
                borderRadius: 20,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }
        }))
    ];
};
