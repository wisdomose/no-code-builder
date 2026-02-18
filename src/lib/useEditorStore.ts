import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EditorElement {
    id: string
    type: 'text' | 'image' | 'button' | 'container' | 'div'
    parentId?: string
    props: {
        x: number
        y: number
        width: number
        height: number
        text?: string
        src?: string
        background?: string
        color?: string
        zIndex?: number
        fontSize?: number
        borderRadius?: number
    }
}

interface CameraState {
    scale: number
    x: number
    y: number
}

interface ArtboardState {
    width: number
    height: number
    background: string
}

interface LayoutState {
    leftWidth: number
    rightWidth: number
    isLeftCollapsed: boolean
    isRightCollapsed: boolean
}

interface EditorState {
    // Elements
    elements: EditorElement[]
    selectedId: string | null

    // Camera (Spatial Viewport)
    camera: CameraState

    // Artboard (Physical Page)
    artboard: ArtboardState

    // Layout (Chrome)
    layout: LayoutState

    // Actions
    addElement: (element: EditorElement) => void
    updateElement: (id: string, props: Partial<EditorElement['props']>) => void
    removeElement: (id: string) => void
    setSelectedId: (id: string | null) => void

    setCamera: (camera: Partial<CameraState>) => void
    setArtboard: (artboard: Partial<ArtboardState>) => void

    setLeftWidth: (width: number) => void
    setRightWidth: (width: number) => void
    toggleLeftCollapse: () => void
    toggleRightCollapse: () => void
}

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            elements: [
                // Card 1: Revenue Recovery Dashboard (Hero)
                {
                    id: 'card-1',
                    type: 'container',
                    props: { x: 120, y: 188, width: 588, height: 524, background: '#ffffff', borderRadius: 24 }
                },
                {
                    id: 'card-1-title',
                    type: 'text',
                    props: { x: 152, y: 220, width: 524, height: 32, text: 'Revenue Recovery Dashboard', color: '#111827', fontSize: 20 }
                },
                {
                    id: 'card-1-desc',
                    type: 'text',
                    props: { x: 152, y: 252, width: 524, height: 48, text: 'Track every dollar saved with our automated recovery workflows.', color: '#6b7280', fontSize: 14 }
                },
                {
                    id: 'card-1-amount',
                    type: 'text',
                    props: { x: 152, y: 316, width: 300, height: 64, text: '$142,580', color: '#10b981', fontSize: 48 }
                },

                // Card 2: AI Support Automation (Wide)
                {
                    id: 'card-2',
                    type: 'container',
                    props: { x: 732, y: 188, width: 588, height: 250, background: '#ffffff', borderRadius: 24 }
                },
                {
                    id: 'card-2-title',
                    type: 'text',
                    props: { x: 764, y: 220, width: 400, height: 32, text: 'Automate 90% of Support', color: '#111827', fontSize: 20 }
                },
                {
                    id: 'card-2-chat-1',
                    type: 'container',
                    props: { x: 920, y: 260, width: 360, height: 40, background: '#4f46e5', borderRadius: 12 }
                },
                {
                    id: 'card-2-chat-1-text',
                    type: 'text',
                    props: { x: 920, y: 260, width: 360, height: 40, text: 'Hi! I noticed your payment failed.', color: '#ffffff', fontSize: 12 }
                },
                {
                    id: 'card-2-chat-2',
                    type: 'container',
                    props: { x: 800, y: 310, width: 360, height: 40, background: '#f3f4f6', borderRadius: 12 }
                },
                {
                    id: 'card-2-chat-2-text',
                    type: 'text',
                    props: { x: 800, y: 310, width: 360, height: 40, text: 'Yes please, that would be great!', color: '#1f2937', fontSize: 12 }
                },

                // Card 3: Integrations (Square)
                {
                    id: 'card-3',
                    type: 'container',
                    props: { x: 732, y: 462, width: 282, height: 250, background: '#ffffff', borderRadius: 24 }
                },
                {
                    id: 'card-3-title',
                    type: 'text',
                    props: { x: 748, y: 494, width: 250, height: 32, text: 'Plays well with others', color: '#111827', fontSize: 16 }
                },

                // Card 4: Speed Metric (Square)
                {
                    id: 'card-4',
                    type: 'container',
                    props: { x: 1038, y: 462, width: 282, height: 250, background: '#ffffff', borderRadius: 24 }
                },
                {
                    id: 'card-4-title',
                    type: 'text',
                    props: { x: 1054, y: 494, width: 250, height: 32, text: 'Sub-second Response', color: '#111827', fontSize: 16 }
                },
                {
                    id: 'card-4-metric',
                    type: 'text',
                    props: { x: 1054, y: 550, width: 250, height: 80, text: '0.8s', color: '#4f46e5', fontSize: 64 }
                },
                {
                    id: 'card-4-pulse-dot',
                    type: 'div',
                    props: { x: 1054, y: 640, width: 10, height: 10, background: '#10b981', borderRadius: 5 }
                },
                {
                    id: 'card-4-pulse-text',
                    type: 'text',
                    props: { x: 1070, y: 640, width: 100, height: 16, text: 'LIVE STATUS', color: '#059669', fontSize: 12 }
                }
            ],
            selectedId: null,

            camera: {
                scale: 1,
                x: 0,
                y: 0,
            },

            artboard: {
                width: 1440,
                height: 900,
                background: '#f9fafb',
            },

            layout: {
                leftWidth: 240,
                rightWidth: 280,
                isLeftCollapsed: false,
                isRightCollapsed: false,
            },

            addElement: (element) =>
                set((state) => ({ elements: [...state.elements, element] })),

            updateElement: (id, props) =>
                set((state) => ({
                    elements: state.elements.map((el) =>
                        el.id === id ? { ...el, props: { ...el.props, ...props } } : el
                    ),
                })),

            removeElement: (id) =>
                set((state) => ({
                    elements: state.elements.filter((el) => el.id !== id),
                    selectedId: state.selectedId === id ? null : state.selectedId,
                })),

            setSelectedId: (id) => set({ selectedId: id }),

            setCamera: (camera) =>
                set((state) => ({ camera: { ...state.camera, ...camera } })),

            setArtboard: (artboard) =>
                set((state) => ({ artboard: { ...state.artboard, ...artboard } })),

            setLeftWidth: (width) =>
                set((state) => ({ layout: { ...state.layout, leftWidth: width } })),

            setRightWidth: (width) =>
                set((state) => ({ layout: { ...state.layout, rightWidth: width } })),

            toggleLeftCollapse: () =>
                set((state) => ({
                    layout: { ...state.layout, isLeftCollapsed: !state.layout.isLeftCollapsed },
                })),

            toggleRightCollapse: () =>
                set((state) => ({
                    layout: { ...state.layout, isRightCollapsed: !state.layout.isRightCollapsed },
                })),
        }),
        {
            name: 'editor-storage',
        }
    )
)
