import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EditorElement {
    id: string
    type: 'text' | 'image' | 'button' | 'container' | 'div'
    parentId?: string | null
    props: {
        x: number
        y: number
        width: number
        height: number
        text?: string
        color?: string
        background?: string
        zIndex?: number
        src?: string
    }
}

interface CanvasState {
    scale: number
    translateX: number
    translateY: number
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

interface EditorStore {
    // State
    elements: EditorElement[]
    selectedId: string | null
    canvas: CanvasState
    artboard: ArtboardState
    layout: LayoutState

    // Actions
    // Layout
    setLeftWidth: (width: number) => void
    setRightWidth: (width: number) => void
    toggleLeftCollapse: () => void
    toggleRightCollapse: () => void

    // Canvas
    setCanvas: (canvas: Partial<CanvasState>) => void
    resetCanvas: () => void

    // Artboard
    setArtboard: (artboard: Partial<ArtboardState>) => void

    // Elements
    addElement: (element: EditorElement) => void
    updateElement: (id: string, props: Partial<EditorElement['props']>) => void
    removeElement: (id: string) => void
    setSelectedId: (id: string | null) => void
}

export const useEditorStore = create<EditorStore>()(
    persist(
        (set) => ({
            // Initial State
            elements: [],
            selectedId: null,
            canvas: {
                scale: 1,
                translateX: 0,
                translateY: 0,
            },
            artboard: {
                width: 1440,
                height: 900,
                background: '#ffffff',
            },
            layout: {
                leftWidth: 260,
                rightWidth: 320,
                isLeftCollapsed: false,
                isRightCollapsed: false,
            },

            // Layout Actions
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

            // Canvas Actions
            setCanvas: (canvas) =>
                set((state) => ({ canvas: { ...state.canvas, ...canvas } })),
            resetCanvas: () =>
                set({
                    canvas: { scale: 1, translateX: 0, translateY: 0 },
                }),

            // Artboard Actions
            setArtboard: (artboard) =>
                set((state) => ({ artboard: { ...state.artboard, ...artboard } })),

            // Element Actions
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
        }),
        {
            name: 'editor-storage',
        }
    )
)
