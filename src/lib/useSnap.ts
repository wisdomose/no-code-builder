import type { EditorElement } from "./useEditorStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SnapLine {
    /** 'x' = vertical line at a fixed x, 'y' = horizontal line at a fixed y */
    axis: "x" | "y";
    /** Position along the snapped axis (artboard-space px) */
    position: number;
    /** Span start (artboard-space px on the other axis) */
    from: number;
    /** Span end (artboard-space px on the other axis) */
    to: number;
}

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface SnapResult {
    dx: number;
    dy: number;
    lines: SnapLine[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** All candidate snap positions on one axis for a moving rect */
function candidateEdges(rect: Rect, axis: "x" | "y") {
    if (axis === "x") return [rect.x, rect.x + rect.w / 2, rect.x + rect.w];
    return [rect.y, rect.y + rect.h / 2, rect.y + rect.h];
}

/** All snap targets on one axis from a reference rect */
function targetEdges(ref: Rect, axis: "x" | "y") {
    if (axis === "x") return [ref.x, ref.x + ref.w / 2, ref.x + ref.w];
    return [ref.y, ref.y + ref.h / 2, ref.y + ref.h];
}

/** Get the best snap correction for one axis. Returns { delta, position } or null. */
function bestSnap(
    movingEdges: number[],
    targetEdgeList: number[],
    threshold: number,
): { delta: number; snappedEdge: number; targetPos: number } | null {
    let best: { delta: number; snappedEdge: number; targetPos: number } | null =
        null;

    for (const movEdge of movingEdges) {
        for (const tgt of targetEdgeList) {
            const delta = tgt - movEdge;
            if (
                Math.abs(delta) <= threshold &&
                (best === null || Math.abs(delta) < Math.abs(best.delta))
            ) {
                best = { delta, snappedEdge: movEdge, targetPos: tgt };
            }
        }
    }
    return best;
}

// ─── Main exported function ───────────────────────────────────────────────────

/**
 * Given a moving element's proposed rect (in artboard space), compute the
 * nearest snap correction and a list of snap-guide lines to display.
 *
 * @param movingRect - The element being moved/resized (proposed position)
 * @param artboardW  - Artboard width  (px, artboard space)
 * @param artboardH  - Artboard height (px, artboard space)
 * @param peers      - Other elements to snap against (exclude the element itself
 *                     and its descendants)
 * @param threshold  - Max pixel distance to snap (default 6, artboard space)
 */
export function getSnapResult(
    movingRect: Rect,
    artboardW: number,
    artboardH: number,
    peers: EditorElement[],
    threshold = 6,
): SnapResult {
    // ── Build all X and Y target sets ──────────────────────────────────────────

    // Artboard snap targets
    const artboardXTargets = [0, artboardW / 2, artboardW];
    const artboardYTargets = [0, artboardH / 2, artboardH];

    // Peer element snap targets
    const peerXTargets: number[] = [];
    const peerYTargets: number[] = [];
    const peerRects: Rect[] = [];

    for (const el of peers) {
        if (typeof el.props.width !== "number" || typeof el.props.height !== "number")
            continue;
        const r: Rect = {
            x: el.props.x,
            y: el.props.y,
            w: el.props.width as number,
            h: el.props.height as number,
        };
        peerRects.push(r);
        peerXTargets.push(...targetEdges(r, "x"));
        peerYTargets.push(...targetEdges(r, "y"));
    }

    const allXTargets = [...artboardXTargets, ...peerXTargets];
    const allYTargets = [...artboardYTargets, ...peerYTargets];

    // ── Find best snap on each axis ────────────────────────────────────────────
    const movX = candidateEdges(movingRect, "x");
    const movY = candidateEdges(movingRect, "y");

    const snapX = bestSnap(movX, allXTargets, threshold);
    const snapY = bestSnap(movY, allYTargets, threshold);

    const dx = snapX?.delta ?? 0;
    const dy = snapY?.delta ?? 0;

    // ── Build snap guide lines ─────────────────────────────────────────────────
    const lines: SnapLine[] = [];

    // Determine the final moved rect after correction
    const finalRect: Rect = {
        x: movingRect.x + dx,
        y: movingRect.y + dy,
        w: movingRect.w,
        h: movingRect.h,
    };

    if (snapX) {
        // Vertical line at snapX.targetPos
        // Span it from the top of the artboard to the bottom, or between the two rects — whichever is more informative
        const allRects = [finalRect, ...peerRects];
        const from = Math.min(...allRects.map((r) => r.y));
        const to = Math.max(...allRects.map((r) => r.y + r.h));
        lines.push({
            axis: "x",
            position: snapX.targetPos,
            from: Math.min(from, 0),
            to: Math.max(to, artboardH),
        });
    }

    if (snapY) {
        const allRects = [finalRect, ...peerRects];
        const from = Math.min(...allRects.map((r) => r.x));
        const to = Math.max(...allRects.map((r) => r.x + r.w));
        lines.push({
            axis: "y",
            position: snapY.targetPos,
            from: Math.min(from, 0),
            to: Math.max(to, artboardW),
        });
    }

    return { dx, dy, lines };
}

// ─── Artboard height helper (exported for Artboard.tsx) ──────────────────────

/**
 * Computes the minimum artboard height required to contain all root-level
 * elements, with `padding` px of breathing room at the bottom.
 */
export function computeArtboardHeight(
    elements: Record<string, EditorElement>,
    minHeight = 900,
    padding = 80,
): number {
    let maxBottom = 0;
    for (const el of Object.values(elements)) {
        if (el.parentId) continue; // only root-level elements
        const h = typeof el.props.height === "number" ? el.props.height : 0;
        const bottom = el.props.y + h;
        if (bottom > maxBottom) maxBottom = bottom;
    }
    return Math.max(minHeight, maxBottom + padding);
}
