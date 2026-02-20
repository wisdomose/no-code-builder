/**
 * Pure element tree utilities — no React, no store imports.
 * Keep these functions here so they can be shared by Canvas, Element, and EditorOverlay
 * without circular dependencies.
 */
import type { EditorElement } from "./useEditorStore";

/** Recursively collect all descendants of `parentId` in depth-first order. */
export function collectDescendants(
    parentId: string,
    elements: Record<string, EditorElement>,
): EditorElement[] {
    const children = Object.values(elements)
        .filter((el) => el.parentId === parentId)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    return children.flatMap((child) => [child, ...collectDescendants(child.id, elements)]);
}

/** Deep-clone an element with a new ID, optionally reparenting and offsetting position. */
export function cloneElement(
    el: EditorElement,
    newId: string,
    newParentId: string | undefined,
    offsetX: number,
    offsetY: number,
): EditorElement {
    return {
        ...el,
        id: newId,
        parentId: newParentId,
        props: { ...el.props, x: el.props.x + offsetX, y: el.props.y + offsetY },
    };
}
