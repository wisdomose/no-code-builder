/**
 * Centralized z-index layer values.
 * All z-index usage in the app should reference this file.
 *
 * Two stacking contexts:
 *  - Canvas  : element content rendered by the user. Sandboxed by
 *              `isolation: isolate` on the artboard, so nothing here
 *              can bleed into the app shell.
 *  - Overlay : editor chrome drawn on top of the canvas.
 *  - Shell   : app chrome (sidebars, toolbar, modals).
 */
export const Z = {
    // ── Canvas elements ────────────────────────────────────────────────
    ELEMENT: 1,

    // Elevated while being dragged so it floats over siblings.
    DRAG_GHOST: 200,

    // ── Editor overlay (inside artboard, above all elements) ───────────
    HOVER_RING: 1000,    // Drop-target highlight
    SELECT_RING: 1010,   // Selection outline
    RESIZE_HANDLES: 1020, // Resize grab handles
    SNAP_GUIDES: 1030,   // Snap alignment lines

    // ── App shell (outside artboard stacking context) ──────────────────
    SIDEBAR: 3000,
    MODAL: 4000,
    TOAST: 5000,
} as const
