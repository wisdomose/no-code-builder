import { create } from 'zustand'
import type { SnapLine } from './useSnap'
import { persist } from 'zustand/middleware'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Non-reactive element refs for direct DOM dimension access
const elementRefs = new Map<string, HTMLElement>();
export const getElementRef = (id: string) => elementRefs.get(id);
export const setElementRef = (id: string, el: HTMLElement | null) => {
    if (el) elementRefs.set(id, el);
    else elementRefs.delete(id);
};

/** Returns the artboard-absolute position of an element by summing ancestor offsets. */
export function getAbsolutePosition(
    element: EditorElement,
    elements: Record<string, EditorElement>
): { x: number; y: number } {
    // For the target element, always trust x/y (especially during dragging/reparenting)
    let x = element.layout.x ?? 0
    let y = element.layout.y ?? 0
    let current = element

    while (current.parentId) {
        const parent = elements[current.parentId]
        if (!parent) break

        // Root elements or absolute elements provide a coordinate base
        if (!parent.parentId || parent.layout.position === 'absolute') {
            x += parent.layout.x ?? 0
            y += parent.layout.y ?? 0
        }
        current = parent
    }
    return { x, y }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ElementLayout {
    position?: 'absolute' | 'flow'
    x?: number
    y?: number
    width: number | 'auto' | '100%'
    height: number | 'auto' | '100%'
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
    zIndex?: number
}

export interface ElementStyle {
    background?: string
    backgroundImage?: string
    backgroundSize?: 'cover' | 'contain' | 'auto' | '100% 100%'
    backgroundPosition?: string
    backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
    borderRadius?: number
    borderWidth?: number
    borderColor?: string
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none'
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
    opacity?: number
    boxShadow?: string
    transform?: string
}

/**
 * Core element types for the editor.
 */
export interface EditorElement {
    id: string
    type: 'text' | 'image' | 'button' | 'container' | 'div'
    name?: string
    parentId?: string
    children?: string[]
    visible?: boolean
    locked?: boolean
    layout: ElementLayout
    style: ElementStyle
    content?: string
    index?: number
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
    past: { elements: Record<string, EditorElement>; rootElements: string[]; artboard: ArtboardState }[]
    future: { elements: Record<string, EditorElement>; rootElements: string[]; artboard: ArtboardState }[]
}

interface EditorState {
    // Elements
    elements: Record<string, EditorElement>
    rootElements: string[]
    selectedId: string | null
    interactionState: InteractionState

    // Camera (Spatial Viewport)
    camera: CameraState

    // Artboard (Physical Page)
    artboard: ArtboardState
    deviceMode: 'desktop' | 'tablet' | 'mobile'

    // Layout (Chrome)
    layout: LayoutState

    // History
    history: HistoryState

    // Theme
    theme: 'dark' | 'light'

    hoveredElementId: string | null
    insertIndex: number | null
    hasHydrated: boolean

    // Snap guides (cleared on mouse-up)
    snapLines: SnapLine[]
    setSnapLines: (lines: SnapLine[]) => void

    // Actions
    setInteractionMode: (mode: InteractionState['mode'], activeId?: string, handle?: string) => void
    addElement: (element: EditorElement) => void
    addElements: (elements: EditorElement[]) => void
    updateElement: (id: string, layout?: Partial<ElementLayout>, style?: Partial<ElementStyle>, content?: string) => void
    updateElements: (updates: { id: string; layout?: Partial<ElementLayout>, style?: Partial<ElementStyle>, content?: string }[]) => void
    /** Updates top-level element metadata (name, visible, locked) — not props. */
    updateElementMeta: (id: string, meta: Partial<Pick<EditorElement, 'name' | 'visible' | 'locked'>>) => void
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
    setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void

    setLeftWidth: (width: number) => void
    setRightWidth: (width: number) => void
    toggleLeftCollapse: () => void
    toggleRightCollapse: () => void
    setTheme: (theme: 'dark' | 'light') => void

    // Sidebar Tabbing
    leftSidebarTab: 'layers' | 'assets' | 'sections'
    setLeftSidebarTab: (tab: 'layers' | 'assets' | 'sections') => void
    reorderElement: (id: string, newParentId: string | undefined, newIndex: number) => void
    setInsertIndex: (index: number | null) => void
    setHasHydrated: (state: boolean) => void
}

const MAX_HISTORY = 100

export const DEVICE_WIDTHS = {
    desktop: 1440,
    tablet: 768,
    mobile: 390
} as const;

const INITIAL_ELEMENTS: Record<string, EditorElement> = {}

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            elements: INITIAL_ELEMENTS,
            rootElements: [],
            selectedId: null,

            camera: { scale: 1, x: 0, y: 0 },
            artboard: { height: 900, background: '#f9fafb' },
            deviceMode: 'desktop',
            layout: { leftWidth: 240, rightWidth: 360, isLeftCollapsed: false, isRightCollapsed: false },
            history: { past: [], future: [] },
            theme: 'dark',
            leftSidebarTab: 'layers',
            hoveredElementId: null,
            insertIndex: null,
            hasHydrated: false,
            snapLines: [],
            setSnapLines: (lines) => set({ snapLines: lines }),
            editingId: null,
            setEditingId: (id) => set({ editingId: id }),

            interactionState: { mode: 'idle' },

            setHasHydrated: (state) => set({ hasHydrated: state }),

            setInteractionMode: (mode, activeId, handle) =>
                set({ interactionState: { mode, activeId, handle } }),

            setLeftSidebarTab: (tab) => set({ leftSidebarTab: tab }),

            saveHistory: () => {
                const { elements, rootElements, artboard, history } = get()
                const snapshot = structuredClone({ elements, rootElements, artboard })
                const newPast = [...history.past, snapshot]
                if (newPast.length > MAX_HISTORY) newPast.shift()
                set({ history: { past: newPast, future: [] } })
            },

            addElement: (element) => {
                get().saveHistory()
                set((state) => {
                    const nextElements = { ...state.elements }
                    const newEl = { children: [], ...element } as EditorElement
                    nextElements[newEl.id] = newEl

                    if (newEl.parentId) {
                        const parent = nextElements[newEl.parentId]
                        if (parent) {
                            nextElements[newEl.parentId] = {
                                ...parent,
                                children: [...(parent.children || []), newEl.id]
                            }
                        }
                    }

                    return {
                        elements: nextElements,
                        rootElements: newEl.parentId ? state.rootElements : [...state.rootElements, newEl.id]
                    }
                })
            },

            addElements: (elementsToAdd) => {
                get().saveHistory()
                set((state) => {
                    const next = { ...state.elements }
                    const nextRoot = [...state.rootElements]
                    const parentChildCount = new Map<string, number>()

                    // 1. First Pass: Add all elements and ensure children initialized
                    for (const el of elementsToAdd) {
                        let index = el.index
                        if (index === undefined && el.parentId) {
                            if (!parentChildCount.has(el.parentId)) {
                                const existing = Object.values(next).filter(e => e.parentId === el.parentId).length
                                parentChildCount.set(el.parentId, existing)
                            }
                            index = parentChildCount.get(el.parentId)!
                            parentChildCount.set(el.parentId, index + 1)
                        }
                        next[el.id] = { children: [], ...el, index } as EditorElement
                        if (!el.parentId && !nextRoot.includes(el.id)) {
                            nextRoot.push(el.id)
                        }
                    }

                    // 2. Second Pass: Synchronize parent.children arrays
                    for (const el of elementsToAdd) {
                        if (el.parentId) {
                            const parent = next[el.parentId]
                            if (parent) {
                                const children = parent.children || []
                                if (!children.includes(el.id)) {
                                    next[el.parentId] = {
                                        ...parent,
                                        children: [...children, el.id]
                                    }
                                }
                            }
                        }
                    }

                    return { elements: next, rootElements: nextRoot }
                })
            },

            updateElement: (id, layout, style, content) => {
                set((state) => {
                    const element = state.elements[id]
                    if (!element) return state

                    const nextElements = { ...state.elements }
                    const newLayout = layout ? { ...element.layout, ...layout } : element.layout

                    // Update the element itself
                    nextElements[id] = {
                        ...element,
                        layout: newLayout,
                        style: style ? { ...element.style, ...style } : element.style,
                        content: content !== undefined ? content : element.content
                    }

                    // If display mode changed, propagate 'position' mode to all children
                    if (layout?.display && layout.display !== element.layout.display) {
                        const isLayoutParent = layout.display === 'flex' || layout.display === 'grid';
                        const childrenIds = element.children || [];

                        childrenIds.forEach(cid => {
                            const child = nextElements[cid];
                            if (child) {
                                nextElements[cid] = {
                                    ...child,
                                    layout: {
                                        ...child.layout,
                                        position: isLayoutParent ? 'flow' : 'absolute'
                                    }
                                };
                            }
                        });
                    }

                    return { elements: nextElements }
                })
            },

            updateElements: (updates) => {
                set((state) => {
                    const next = { ...state.elements }
                    for (const { id, layout, style, content } of updates) {
                        const el = next[id]
                        if (el) {
                            next[id] = {
                                ...el,
                                layout: layout ? { ...el.layout, ...layout } : el.layout,
                                style: style ? { ...el.style, ...style } : el.style,
                                content: content !== undefined ? content : el.content
                            }
                        }
                    }
                    return { elements: next }
                })
            },

            updateElementMeta: (id, meta) => {
                set((state) => {
                    const el = state.elements[id]
                    if (!el) return state
                    return {
                        elements: { ...state.elements, [id]: { ...el, ...meta } }
                    }
                })
            },

            removeElement: (id) => {
                get().saveHistory()
                set((state) => {
                    const elToRemove = state.elements[id]
                    if (!elToRemove) return state

                    // 1. Collect all descendants
                    const toDelete = new Set<string>()
                    const queue = [id]
                    while (queue.length) {
                        const current = queue.pop()!
                        toDelete.add(current)
                        for (const el of Object.values(state.elements)) {
                            if (el.parentId === current) queue.push(el.id)
                        }
                    }

                    const nextElements = { ...state.elements }

                    // 2. Remove from parent's children array
                    if (elToRemove.parentId) {
                        const parent = nextElements[elToRemove.parentId]
                        if (parent) {
                            nextElements[elToRemove.parentId] = {
                                ...parent,
                                children: (parent.children || []).filter(cid => cid !== id)
                            }
                        }
                    }

                    // 3. Delete everything collected
                    const remaining = Object.fromEntries(
                        Object.entries(nextElements).filter(([k]) => !toDelete.has(k))
                    )

                    return {
                        elements: remaining,
                        rootElements: state.rootElements.filter((rid) => !toDelete.has(rid)),
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

                // Calculate current absolute position (best effort)
                // If the element is currently flow, x/y might be 0 in store but offset in DOM.
                // However, reparentElement is usually called after the store has updated x/y during drag
                // OR from the Layer Tree where we don't necessarily care about preserving pixel coords perfectly.
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

                set((s) => {
                    const el = s.elements[id]
                    if (!el) return s
                    const nextElements = { ...s.elements }

                    // 1. Remove from old parent's children array
                    if (el.parentId) {
                        const oldParent = nextElements[el.parentId]
                        if (oldParent) {
                            nextElements[el.parentId] = {
                                ...oldParent,
                                children: (oldParent.children || []).filter(cid => cid !== id)
                            }
                        }
                    }

                    // 2. Insert into new parent's children array
                    if (newParentId) {
                        const newParent = nextElements[newParentId]
                        if (newParent) {
                            nextElements[newParentId] = {
                                ...newParent,
                                children: [...(newParent.children || []), id]
                            }
                        }
                    }

                    // 3. Update rootElements if moving to/from root
                    let nextRootElements = [...s.rootElements]
                    if (!el.parentId && newParentId) {
                        nextRootElements = nextRootElements.filter(rid => rid !== id)
                    } else if (el.parentId && !newParentId) {
                        nextRootElements = [...nextRootElements, id]
                    }

                    // 4. Update the element itself
                    const isLayoutParent = newParentId ? nextElements[newParentId]?.layout.display === 'flex' || nextElements[newParentId]?.layout.display === 'grid' : false;

                    nextElements[id] = {
                        ...el,
                        parentId: newParentId,
                        layout: {
                            ...el.layout,
                            x: newX,
                            y: newY,
                            position: isLayoutParent ? 'flow' : 'absolute'
                        },
                        index: newParentId ? (nextElements[newParentId]?.children?.length || 1) - 1 : nextRootElements.length - 1
                    }

                    return {
                        elements: nextElements,
                        rootElements: nextRootElements,
                    };
                });
            },

            setHoveredElementId: (id) => set({ hoveredElementId: id }),
            setInsertIndex: (index) => set({ insertIndex: index }),

            undo: () => {
                const { past, future } = get().history
                if (!past.length) return

                const previous = past[past.length - 1]
                const newPast = past.slice(0, -1)
                const current = structuredClone({
                    elements: get().elements,
                    rootElements: get().rootElements,
                    artboard: get().artboard
                })

                set({
                    elements: previous.elements,
                    rootElements: previous.rootElements,
                    artboard: previous.artboard,
                    history: {
                        past: newPast,
                        future: [current, ...future].slice(0, MAX_HISTORY)
                    }
                })
            },

            redo: () => {
                const { past, future } = get().history
                if (!future.length) return

                const [next, ...newFuture] = future
                const current = structuredClone({
                    elements: get().elements,
                    rootElements: get().rootElements,
                    artboard: get().artboard
                })

                set({
                    elements: next.elements,
                    rootElements: next.rootElements,
                    artboard: next.artboard,
                    history: {
                        past: [...past, current].slice(-MAX_HISTORY),
                        future: newFuture
                    }
                })
            },

            setCamera: (camera) =>
                set((state) => ({ camera: { ...state.camera, ...camera } })),

            resetCamera: (containerWidth, containerHeight) => {
                const { artboard, deviceMode } = get()
                const artboardWidth = DEVICE_WIDTHS[deviceMode]
                if (containerWidth && containerHeight) {
                    const padding = 100
                    const fitScale = Math.min(
                        1,
                        (containerWidth - padding) / artboardWidth,
                        (containerHeight - padding) / artboard.height
                    )
                    set({
                        camera: {
                            scale: fitScale,
                            x: (containerWidth - artboardWidth * fitScale) / 2,
                            y: (containerHeight - artboard.height * fitScale) / 2,
                        }
                    })
                } else {
                    set({ camera: { scale: 1, x: 0, y: 0 } })
                }
            },

            setArtboard: (artboard) => {
                get().saveHistory()
                set((state) => ({ artboard: { ...state.artboard, ...artboard } }))
            },

            setDeviceMode: (mode) => set({ deviceMode: mode }),

            setLeftWidth: (width) =>
                set((state) => ({
                    layout: { ...state.layout, leftWidth: Math.min(420, Math.max(180, width)) }
                })),

            setRightWidth: (width) =>
                set((state) => ({
                    layout: { ...state.layout, rightWidth: Math.min(480, Math.max(360, width)) }
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

                set((state) => {
                    const el = state.elements[id]
                    if (!el) return state

                    const oldParentId = el.parentId
                    const isReparenting = oldParentId !== newParentId

                    const nextElements = { ...state.elements }

                    // 1. Remove from old parent
                    if (oldParentId) {
                        const oldParent = nextElements[oldParentId]
                        if (oldParent) {
                            nextElements[oldParentId] = {
                                ...oldParent,
                                children: (oldParent.children || []).filter((cid) => cid !== id)
                            }
                        }
                    }

                    // 2. Insert into new parent
                    if (newParentId) {
                        const newParent = nextElements[newParentId]
                        if (newParent) {
                            const newChildren = [...(newParent.children || [])]
                            newChildren.splice(newIndex, 0, id)
                            nextElements[newParentId] = {
                                ...newParent,
                                children: newChildren
                            }
                        }

                        const isLayoutParent = newParent?.layout.display === 'flex' || newParent?.layout.display === 'grid';

                        // Update element's parent pointer and mode
                        nextElements[id] = {
                            ...el,
                            parentId: newParentId,
                            index: newIndex,
                            layout: {
                                ...el.layout,
                                position: isLayoutParent ? 'flow' : 'absolute'
                            }
                        }
                    } else {
                        // Moving to root
                        nextElements[id] = {
                            ...el,
                            parentId: undefined,
                            index: newIndex,
                            layout: {
                                ...el.layout,
                                position: 'absolute'
                            }
                        }
                    }

                    // 3. Update rootElements if needed
                    let nextRootElements = [...state.rootElements]
                    if (isReparenting) {
                        if (!oldParentId) {
                            nextRootElements = nextRootElements.filter((rid) => rid !== id)
                        }
                        if (!newParentId) {
                            nextRootElements.splice(newIndex, 0, id)
                        }
                    } else if (!newParentId) {
                        // Reordering within root
                        nextRootElements = nextRootElements.filter((rid) => rid !== id)
                        nextRootElements.splice(newIndex, 0, id)
                    }

                    // 4. Clean up indices for siblings in affected parents
                    const touchedParents = new Set<string | undefined>([oldParentId, newParentId])
                    touchedParents.forEach((pid) => {
                        if (pid) {
                            const parent = nextElements[pid]
                            if (parent && parent.children) {
                                parent.children.forEach((cid, idx) => {
                                    if (nextElements[cid]) {
                                        nextElements[cid] = { ...nextElements[cid], index: idx }
                                    }
                                })
                            }
                        } else {
                            nextRootElements.forEach((rid, idx) => {
                                if (nextElements[rid]) {
                                    nextElements[rid] = { ...nextElements[rid], index: idx }
                                }
                            })
                        }
                    })

                    return {
                        elements: nextElements,
                        rootElements: nextRootElements
                    }
                })
            }
        }),
        {
            name: 'editor-storage',
            version: 5,
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true)
                }
            }
        }
    )
)
