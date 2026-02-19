import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Core element types for the editor.
 */
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

interface HistoryState {
    past: { elements: EditorElement[]; artboard: ArtboardState }[]
    future: { elements: EditorElement[]; artboard: ArtboardState }[]
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

    // History
    history: HistoryState

    // Theme
    theme: 'dark' | 'light'

    // Actions
    addElement: (element: EditorElement) => void
    updateElement: (id: string, props: Partial<EditorElement['props']>) => void
    updateElements: (updates: { id: string; props: Partial<EditorElement['props']> }[]) => void
    removeElement: (id: string) => void
    setSelectedId: (id: string | null) => void

    saveHistory: () => void
    undo: () => void
    redo: () => void

    setCamera: (camera: Partial<CameraState>) => void
    resetCamera: (containerWidth?: number, containerHeight?: number) => void
    setArtboard: (artboard: Partial<ArtboardState>) => void

    setLeftWidth: (width: number) => void
    setRightWidth: (width: number) => void
    toggleLeftCollapse: () => void
    toggleRightCollapse: () => void
    setTheme: (theme: 'dark' | 'light') => void

    // Sidebar Tabbing
    leftSidebarTab: 'layers' | 'assets' | 'sections'
    setLeftSidebarTab: (tab: 'layers' | 'assets' | 'sections') => void
}

const MAX_HISTORY = 100

/**
 * Initial set of elements for the landing page demo.
 */
const INITIAL_ELEMENTS: EditorElement[] = [
    { id: 'card-1', type: 'container', props: { x: 120, y: 188, width: 588, height: 524, background: '#ffffff', borderRadius: 24 } },
    { id: 'card-1-title', type: 'text', parentId: 'card-1', props: { x: 152, y: 220, width: 524, height: 32, text: 'Revenue Recovery Dashboard', color: '#111827', fontSize: 20 } },
    { id: 'card-1-desc', type: 'text', parentId: 'card-1', props: { x: 152, y: 252, width: 524, height: 48, text: 'Track every dollar saved with our automated recovery workflows.', color: '#6b7280', fontSize: 14 } },
    { id: 'card-1-amount', type: 'text', parentId: 'card-1', props: { x: 152, y: 316, width: 300, height: 64, text: '$142,580', color: '#10b981', fontSize: 48 } },
    { id: 'card-2', type: 'container', props: { x: 732, y: 188, width: 588, height: 250, background: '#ffffff', borderRadius: 24 } },
    { id: 'card-2-title', type: 'text', parentId: 'card-2', props: { x: 764, y: 220, width: 400, height: 32, text: 'Automate 90% of Support', color: '#111827', fontSize: 20 } },
    { id: 'card-2-chat-1', type: 'container', parentId: 'card-2', props: { x: 920, y: 260, width: 360, height: 40, background: '#4f46e5', borderRadius: 12 } },
    { id: 'card-2-chat-1-text', type: 'text', parentId: 'card-2-chat-1', props: { x: 920, y: 260, width: 360, height: 40, text: 'Hi! I noticed your payment failed.', color: '#ffffff', fontSize: 12 } },
    { id: 'card-2-chat-2', type: 'container', parentId: 'card-2', props: { x: 800, y: 310, width: 360, height: 40, background: '#f3f4f6', borderRadius: 12 } },
    { id: 'card-2-chat-2-text', type: 'text', parentId: 'card-2-chat-2', props: { x: 800, y: 310, width: 360, height: 40, text: 'Yes please, that would be great!', color: '#1f2937', fontSize: 12 } },
    { id: 'card-3', type: 'container', props: { x: 732, y: 462, width: 282, height: 250, background: '#ffffff', borderRadius: 24 } },
    { id: 'card-3-title', type: 'text', parentId: 'card-3', props: { x: 748, y: 494, width: 250, height: 32, text: 'Plays well with others', color: '#111827', fontSize: 16 } },
    { id: 'card-4', type: 'container', props: { x: 1038, y: 462, width: 282, height: 250, background: '#ffffff', borderRadius: 24 } },
    { id: 'card-4-title', type: 'text', parentId: 'card-4', props: { x: 1054, y: 494, width: 250, height: 32, text: 'Sub-second Response', color: '#111827', fontSize: 16 } },
    { id: 'card-4-metric', type: 'text', parentId: 'card-4', props: { x: 1054, y: 550, width: 250, height: 80, text: '0.8s', color: '#4f46e5', fontSize: 64 } },
    { id: 'card-4-pulse-dot', type: 'div', parentId: 'card-4', props: { x: 1054, y: 640, width: 10, height: 10, background: '#10b981', borderRadius: 5 } },
    { id: 'card-4-pulse-text', type: 'text', parentId: 'card-4', props: { x: 1070, y: 640, width: 100, height: 16, text: 'LIVE STATUS', color: '#059669', fontSize: 12 } }
]

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            elements: INITIAL_ELEMENTS,
            selectedId: null,

            camera: { scale: 1, x: 0, y: 0 },
            artboard: { width: 1440, height: 900, background: '#f9fafb' },
            layout: { leftWidth: 240, rightWidth: 280, isLeftCollapsed: false, isRightCollapsed: false },
            history: { past: [], future: [] },
            theme: 'dark',
            leftSidebarTab: 'layers',

            setLeftSidebarTab: (tab) => set({ leftSidebarTab: tab }),

            /**
             * Pushes current elements and artboard state into history.
             */
            saveHistory: () => {
                const { elements, artboard, history } = get()
                const newPast = [...history.past, { elements: JSON.parse(JSON.stringify(elements)), artboard: { ...artboard } }]
                if (newPast.length > MAX_HISTORY) newPast.shift()
                set({ history: { past: newPast, future: [] } })
            },

            addElement: (element) => {
                get().saveHistory()
                set((state) => ({ elements: [...state.elements, element] }))
            },

            updateElement: (id, props) => {
                set((state) => ({
                    elements: state.elements.map((el) =>
                        el.id === id ? { ...el, props: { ...el.props, ...props } } : el
                    ),
                }))
            },

            updateElements: (updates) => {
                set((state) => ({
                    elements: state.elements.map((el) => {
                        const update = updates.find((u) => u.id === el.id)
                        return update ? { ...el, props: { ...el.props, ...update.props } } : el
                    }),
                }))
            },

            removeElement: (id) => {
                get().saveHistory()
                set((state) => ({
                    elements: state.elements.filter((el) => el.id !== id),
                    selectedId: state.selectedId === id ? null : state.selectedId,
                }))
            },

            setSelectedId: (id) => set({ selectedId: id }),

            /**
             * Performs a state undo by popping the last history entry.
             */
            undo: () => {
                const { past, future } = get().history
                if (past.length === 0) return

                const previous = past[past.length - 1]
                const newPast = past.slice(0, past.length - 1)

                const current = {
                    elements: JSON.parse(JSON.stringify(get().elements)),
                    artboard: { ...get().artboard }
                }

                set({
                    elements: previous.elements,
                    artboard: previous.artboard,
                    history: {
                        past: newPast,
                        future: [current, ...future].slice(0, MAX_HISTORY)
                    }
                })
            },

            /**
             * Performs a state redo by shifting the first future history entry.
             */
            redo: () => {
                const { past, future } = get().history
                if (future.length === 0) return

                const next = future[0]
                const newFuture = future.slice(1)

                const current = {
                    elements: JSON.parse(JSON.stringify(get().elements)),
                    artboard: { ...get().artboard }
                }

                set({
                    elements: next.elements,
                    artboard: next.artboard,
                    history: {
                        past: [...past, current].slice(-MAX_HISTORY),
                        future: newFuture
                    }
                })
            },

            setCamera: (camera) =>
                set((state) => ({ camera: { ...state.camera, ...camera } })),

            /**
             * Resets the camera to center the artboard in the viewport.
             * @param containerWidth Optional workspace width for centering logic.
             * @param containerHeight Optional workspace height for centering logic.
             */
            resetCamera: (containerWidth, containerHeight) => {
                const { artboard } = get()
                if (containerWidth && containerHeight) {
                    const padding = 100 // 50px breathing room on each side
                    const availableWidth = containerWidth - padding
                    const availableHeight = containerHeight - padding

                    // Calculate scale to fit artboard in available space, cap at 1.0 (100%)
                    const fitScale = Math.min(
                        1,
                        availableWidth / artboard.width,
                        availableHeight / artboard.height
                    )

                    // Center artboard at the calculated scale
                    const x = (containerWidth - artboard.width * fitScale) / 2
                    const y = (containerHeight - artboard.height * fitScale) / 2

                    set({ camera: { scale: fitScale, x, y } })
                } else {
                    set({ camera: { scale: 1, x: 0, y: 0 } })
                }
            },

            setArtboard: (artboard) => {
                get().saveHistory()
                set((state) => ({ artboard: { ...state.artboard, ...artboard } }))
            },

            setLeftWidth: (width) =>
                set((state) => ({
                    layout: {
                        ...state.layout,
                        leftWidth: Math.min(420, Math.max(180, width))
                    }
                })),

            setRightWidth: (width) =>
                set((state) => ({
                    layout: {
                        ...state.layout,
                        rightWidth: Math.min(480, Math.max(240, width))
                    }
                })),

            toggleLeftCollapse: () =>
                set((state) => ({
                    layout: { ...state.layout, isLeftCollapsed: !state.layout.isLeftCollapsed },
                })),

            toggleRightCollapse: () =>
                set((state) => ({
                    layout: { ...state.layout, isRightCollapsed: !state.layout.isRightCollapsed },
                })),

            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'editor-storage',
            version: 2, // Bumped for history state schema change
        }
    )
)
