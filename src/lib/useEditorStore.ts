import { create } from 'zustand'
import type { SnapLine } from './useSnap'
import { persist } from 'zustand/middleware'

function getAbsolutePosition(
    element: EditorElement,
    elements: Record<string, EditorElement>
): { x: number; y: number } {
    let x = element.props.x
    let y = element.props.y
    let current = element
    while (current.parentId) {
        const parent = elements[current.parentId]
        if (!parent) break
        x += parent.props.x
        y += parent.props.y
        current = parent
    }
    return { x, y }
}

/**
 * Core element types for the editor.
 */
export interface EditorElement {
    id: string
    type: 'text' | 'image' | 'button' | 'container' | 'div'
    parentId?: string
    index?: number
    // Element metadata
    name?: string
    visible?: boolean
    locked?: boolean
    props: {
        x: number
        y: number
        width: number | 'auto'
        height: number | 'auto'
        text?: string
        src?: string
        // Background
        background?: string
        backgroundImage?: string
        backgroundSize?: 'cover' | 'contain' | 'auto' | '100% 100%'
        backgroundPosition?: string
        backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
        // Border
        borderRadius?: number
        borderWidth?: number
        borderColor?: string
        borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none'
        // Stacking
        zIndex?: number
        // Layout
        display?: 'flex' | 'block' | 'grid'
        flexDirection?: 'row' | 'column'
        flexWrap?: 'wrap' | 'nowrap'
        gridTemplateColumns?: string
        gridTemplateRows?: string
        alignItems?: 'start' | 'center' | 'end' | 'stretch'
        justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch'
        alignSelf?: 'auto' | 'start' | 'center' | 'end' | 'stretch'
        gap?: number
        padding?: number | string
        overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
        // Typography
        color?: string
        fontSize?: number
        fontFamily?: string
        fontWeight?: number | string
        fontStyle?: 'normal' | 'italic'
        textDecoration?: 'none' | 'underline' | 'line-through'
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
        textAlign?: 'left' | 'center' | 'right' | 'justify'
        lineHeight?: number | string
        letterSpacing?: string
        // Effects
        opacity?: number
        boxShadow?: string
        transform?: string
    }
}

interface CameraState {
    scale: number
    x: number
    y: number
}

interface InteractionState {
    mode: 'idle' | 'dragging' | 'resizing' | 'panning' | 'marquee'
    activeId?: string
    handle?: string
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
    past: { elements: Record<string, EditorElement>; artboard: ArtboardState }[]
    future: { elements: Record<string, EditorElement>; artboard: ArtboardState }[]
}

interface EditorState {
    // Elements
    elements: Record<string, EditorElement>
    selectedId: string | null
    interactionState: InteractionState

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

    hoveredElementId: string | null
    insertIndex: number | null

    // Snap guides (cleared on mouse-up)
    snapLines: SnapLine[]
    setSnapLines: (lines: SnapLine[]) => void

    // Actions
    setInteractionMode: (mode: InteractionState['mode'], activeId?: string, handle?: string) => void
    addElement: (element: EditorElement) => void
    addElements: (elements: EditorElement[]) => void
    updateElement: (id: string, props: Partial<EditorElement['props']>) => void
    updateElements: (updates: { id: string; props: Partial<EditorElement['props']> }[]) => void
    removeElement: (id: string) => void
    reparentElement: (id: string, newParentId?: string) => void
    setSelectedId: (id: string | null) => void
    setHoveredElementId: (id: string | null) => void

    // Text Editing
    editingId: string | null
    setEditingId: (id: string | null) => void

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
    reorderElement: (id: string, newParentId: string, newIndex: number) => void
    setInsertIndex: (index: number | null) => void
}

const MAX_HISTORY = 100

/**
 * Initial set of elements for the landing page demo.
 */
const INITIAL_ELEMENTS: Record<string, EditorElement> = {}

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            elements: INITIAL_ELEMENTS,
            selectedId: null,

            camera: { scale: 1, x: 0, y: 0 },
            artboard: { width: 1440, height: 900, background: '#f9fafb' },
            layout: { leftWidth: 240, rightWidth: 360, isLeftCollapsed: false, isRightCollapsed: false },
            history: { past: [], future: [] },
            theme: 'dark',
            leftSidebarTab: 'layers',
            hoveredElementId: null,
            insertIndex: null,
            snapLines: [],
            setSnapLines: (lines) => set({ snapLines: lines }),
            editingId: null,
            setEditingId: (id) => set({ editingId: id }),

            interactionState: { mode: 'idle' },

            setInteractionMode: (mode, activeId, handle) =>
                set({ interactionState: { mode, activeId, handle } }),

            setLeftSidebarTab: (tab) => set({ leftSidebarTab: tab }),

            /**
             * Pushes current elements and artboard state into history.
             */
            saveHistory: () => {
                const { elements, artboard, history } = get()
                const snapshot = structuredClone({ elements, artboard })
                const newPast = [...history.past, snapshot]
                if (newPast.length > MAX_HISTORY) newPast.shift()
                set({ history: { past: newPast, future: [] } })
            },

            addElement: (element) => {
                get().saveHistory()
                set((state) => ({
                    elements: { ...state.elements, [element.id]: element }
                }))
            },

            addElements: (elements) => {
                get().saveHistory()
                set((state) => {
                    const newElements = { ...state.elements }
                    elements.forEach(el => {
                        newElements[el.id] = el
                    })
                    return { elements: newElements }
                })
            },

            updateElement: (id, props) => {
                set((state) => {
                    const element = state.elements[id]
                    if (!element) return state
                    return {
                        elements: {
                            ...state.elements,
                            [id]: { ...element, props: { ...element.props, ...props } }
                        }
                    }
                })
            },

            updateElements: (updates) => {
                set((state) => {
                    const newElements = { ...state.elements }
                    updates.forEach(update => {
                        const element = newElements[update.id]
                        if (element) {
                            newElements[update.id] = { ...element, props: { ...element.props, ...update.props } }
                        }
                    })
                    return { elements: newElements }
                })
            },

            removeElement: (id) => {
                get().saveHistory()
                set((state) => {
                    // Collect all descendant IDs recursively
                    const toDelete = new Set<string>()
                    const collect = (elId: string) => {
                        toDelete.add(elId)
                        Object.values(state.elements).forEach(el => {
                            if (el.parentId === elId) collect(el.id)
                        })
                    }
                    collect(id)
                    const remaining = Object.fromEntries(
                        Object.entries(state.elements).filter(([k]) => !toDelete.has(k))
                    )
                    return {
                        elements: remaining,
                        selectedId: toDelete.has(state.selectedId ?? '') ? null : state.selectedId,
                    }
                })
            },

            setSelectedId: (id) => set({ selectedId: id }),

            reparentElement: (id, newParentId) => {
                const state = get()
                const element = state.elements[id]
                if (!element || element.parentId === newParentId) return

                get().saveHistory()

                // Calculate absolute position before change
                const { x: absX, y: absY } = getAbsolutePosition(element, state.elements)

                let newX = absX
                let newY = absY

                if (newParentId) {
                    const newParent = state.elements[newParentId]
                    if (newParent) {
                        const { x: parentAbsX, y: parentAbsY } = getAbsolutePosition(newParent, state.elements)
                        newX = absX - parentAbsX
                        newY = absY - parentAbsY
                    }
                }

                set((state) => ({
                    elements: {
                        ...state.elements,
                        [id]: {
                            ...element,
                            parentId: newParentId,
                            props: { ...element.props, x: newX, y: newY }
                        }
                    }
                }))
            },

            setHoveredElementId: (id) => set({ hoveredElementId: id }),
            setInsertIndex: (index) => set({ insertIndex: index }),

            /**
             * Performs a state undo by popping the last history entry.
             */
            undo: () => {
                const { past, future } = get().history
                if (past.length === 0) return

                const previous = past[past.length - 1]
                const newPast = past.slice(0, past.length - 1)

                const current = structuredClone({
                    elements: get().elements,
                    artboard: get().artboard
                })

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

                const current = structuredClone({
                    elements: get().elements,
                    artboard: get().artboard
                })

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
                        rightWidth: Math.min(480, Math.max(360, width))
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

            reorderElement: (id, newParentId, newIndex) => {
                get().saveHistory()
                const state = get()
                const element = state.elements[id]
                if (!element) return

                const oldParentId = element.parentId

                // Get all siblings in the new parent
                const siblings = Object.values(state.elements)
                    .filter(el => el.parentId === newParentId && el.id !== id)
                    .sort((a, b) => (a.index || 0) - (b.index || 0))

                // Insert into new position
                siblings.splice(newIndex, 0, element)

                // Update all affected indices
                const updates: Record<string, Partial<EditorElement>> = {}
                siblings.forEach((el, idx) => {
                    if (el.index !== idx || el.parentId !== newParentId || el.id === id) { // Include the moved element itself to update parentId
                        updates[el.id] = { index: idx, parentId: newParentId }
                    }
                })

                // If moved from another parent, re-index the old parent's children to fill the gap
                if (oldParentId && oldParentId !== newParentId) {
                    const oldSiblings = Object.values(state.elements)
                        .filter(el => el.parentId === oldParentId && el.id !== id)
                        .sort((a, b) => (a.index || 0) - (b.index || 0))

                    oldSiblings.forEach((el, idx) => {
                        if (el.index !== idx) {
                            updates[el.id] = { ...updates[el.id], index: idx } // Merge if somehow overlapping, though unlikely for different parents
                        }
                    })
                }

                set(state => {
                    const newElements = { ...state.elements }
                    Object.entries(updates).forEach(([elId, changes]) => {
                        newElements[elId] = { ...newElements[elId], ...changes }
                    })
                    return { elements: newElements }
                })
            }
        }),
        {
            name: 'editor-storage',
            version: 5, // Bumped for layout width adjustments (360px)
        }
    )
)
