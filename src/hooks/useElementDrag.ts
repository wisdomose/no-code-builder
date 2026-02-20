import { useEditorStore, getElementRef } from "@/lib/useEditorStore";
import type { EditorElement as IEditorElement } from "@/lib/useEditorStore";
import { getSnapResult, computeArtboardHeight } from "@/lib/useSnap";
import { collectDescendants } from "@/lib/elementUtils";
import React from "react";

export function useElementDrag(element: IEditorElement, isParentFlow: boolean) {
    const setSelectedId = useEditorStore((s) => s.setSelectedId);

    const startDrag = (clientX: number, clientY: number) => {
        const store = useEditorStore.getState();
        if (store.editingId === element.id) return;
        if (element.locked) return;

        store.saveHistory();
        setSelectedId(element.id);

        const currentElements = store.elements;
        const startX = clientX;
        const startY = clientY;

        let startPropX = element.props.x;
        let startPropY = element.props.y;

        const elementNode = getElementRef(element.id);
        if (elementNode && elementNode.parentElement) {
            const elRect = elementNode.getBoundingClientRect();
            const parentRect = elementNode.parentElement.getBoundingClientRect();
            const cam = store.camera;

            if (isParentFlow) {
                startPropX = Math.round((elRect.left - parentRect.left) / cam.scale);
                startPropY = Math.round((elRect.top - parentRect.top) / cam.scale);
            }
        }

        const affectedElements = [
            element,
            ...collectDescendants(element.id, currentElements),
        ];
        const affectedIds = new Set(affectedElements.map((el) => el.id));

        const startPositions = affectedElements.map((el) => ({
            id: el.id,
            x: el.id === element.id ? startPropX : el.props.x,
            y: el.id === element.id ? startPropY : el.props.y,
        }));

        let isDragStarted = false;
        let rafId: number | null = null;

        const handleMove = (clientX: number, clientY: number) => {
            const currentCamera = useEditorStore.getState().camera;
            let dx = (clientX - startX) / currentCamera.scale;
            let dy = (clientY - startY) / currentCamera.scale;

            if (!isDragStarted) {
                if (Math.hypot(clientX - startX, clientY - startY) > 3) {
                    isDragStarted = true;
                    store.setInteractionMode("dragging", element.id);

                    if (isParentFlow) {
                        store.updateElement(element.id, {
                            x: startPropX,
                            y: startPropY,
                        });
                    }
                } else {
                    return;
                }
            }

            if (!isParentFlow) {
                const state = useEditorStore.getState();
                const { artboard, elements: allEls } = state;
                const artboardH = computeArtboardHeight(allEls, artboard.height);

                const rawX = startPropX + dx;
                const rawY = startPropY + dy;
                const elW =
                    typeof element.props.width === "number" ? element.props.width : 0;
                const elH =
                    typeof element.props.height === "number" ? element.props.height : 0;

                const peers = Object.values(allEls).filter(
                    (el) => el.parentId === element.parentId && !affectedIds.has(el.id),
                );

                const snap = getSnapResult(
                    { x: rawX, y: rawY, w: elW, h: elH },
                    artboard.width,
                    artboardH,
                    peers,
                );

                dx += snap.dx;
                dy += snap.dy;
                state.setSnapLines(snap.lines);
            }

            const updates = startPositions.map((pos) => ({
                id: pos.id,
                props: {
                    x: Math.round(pos.x + dx),
                    y: Math.round(pos.y + dy),
                },
            }));
            store.updateElements(updates);

            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const targets = document.elementsFromPoint(clientX, clientY);
                let targetId = null;
                for (const t of targets) {
                    const id = t.getAttribute("data-element-id");
                    if (id && id !== element.id && !affectedIds.has(id)) {
                        targetId = id;
                        break;
                    }
                }

                if (targetId) {
                    const potentialParent = useEditorStore.getState().elements[targetId];
                    if (
                        potentialParent &&
                        (potentialParent.type === "container" ||
                            potentialParent.type === "div")
                    ) {
                        store.setHoveredElementId(targetId);

                        if (potentialParent.props.display === "flex") {
                            const latestElements = useEditorStore.getState().elements;
                            const siblings = Object.values(latestElements)
                                .filter(
                                    (el) => el.parentId === targetId && el.id !== element.id,
                                )
                                .sort((a, b) => (a.index || 0) - (b.index || 0));

                            let foundIndex = siblings.length;
                            for (let i = 0; i < siblings.length; i++) {
                                const siblingNode = getElementRef(siblings[i].id);
                                if (siblingNode) {
                                    const rect = siblingNode.getBoundingClientRect();
                                    const isRow = potentialParent.props.flexDirection === "row";
                                    const center = isRow
                                        ? rect.left + rect.width / 2
                                        : rect.top + rect.height / 2;
                                    const mousePos = isRow ? clientX : clientY;
                                    if (mousePos < center) {
                                        foundIndex = i;
                                        break;
                                    }
                                }
                            }
                            store.setInsertIndex(foundIndex);
                        } else {
                            store.setInsertIndex(null);
                        }
                    } else {
                        store.setHoveredElementId(null);
                        store.setInsertIndex(null);
                    }
                } else {
                    store.setHoveredElementId(null);
                    store.setInsertIndex(null);
                }
            });
        };

        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        };

        const handleEnd = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleEnd);
            window.removeEventListener("touchcancel", handleEnd);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            useEditorStore.getState().setSnapLines([]);

            if (!isDragStarted) return;

            const finalState = useEditorStore.getState();
            const finalHoveredId = finalState.hoveredElementId;
            const latestElements = finalState.elements;

            if (finalHoveredId) {
                const parentEl = latestElements[finalHoveredId];
                const isFlex = parentEl?.props.display === "flex";
                if (isFlex) {
                    const index = finalState.insertIndex ?? 0;
                    store.reorderElement(element.id, finalHoveredId, index);
                } else {
                    store.reparentElement(element.id, finalHoveredId);
                }
            } else {
                store.reparentElement(element.id, undefined);
            }

            store.setHoveredElementId(null);
            store.setInsertIndex(null);
            store.setInteractionMode("idle");
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleEnd);
        window.addEventListener("touchcancel", handleEnd);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        startDrag(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        e.stopPropagation();
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    };

    return { handleMouseDown, handleTouchStart };
}
