// components/StepScroller/StepScroller.jsx
import React, { useRef, useState, useCallback, useMemo } from "react";
import StepScrollerItem from "./StepScrollerItem";
import useStepScrollerGestures from "./useStepScrollerGestures";
import useStepScrollerSync from "./useStepScrollerSync";
import {
    ITEM_HEIGHT,
    normalizeIndex,
    getOpacity,
} from "./stepScrollerUtils";

export default function StepScroller({
                                         items,
                                         selectedIndex = 0,
                                         onItemSelect,
                                         onItemClick,
                                     }) {
    const containerRef = useRef(null);
    const itemsCount = items.length;

    // topIndex is index in original items (0..N-1)
    const [topIndex, setTopIndex] = useState(() =>
        normalizeIndex(selectedIndex, itemsCount)
    );

    // Tripled list for rendering (visual infinite)
    const tripleItems = useMemo(() => [...items, ...items, ...items], [items]);

    // scroll one step: delta is +1 or -1
    const scrollStep = useCallback(
        (delta) => {
            if (!itemsCount) return;
            const newIndex = normalizeIndex(topIndex + delta, itemsCount);
            setTopIndex(newIndex);
            onItemSelect?.(items[newIndex]);

            // scroll to corresponding item in middle copy
            const target = (newIndex + itemsCount) * ITEM_HEIGHT;
            if (containerRef.current) {
                containerRef.current.scrollTo({ top: target, behavior: "smooth" });
            }
        },
        [topIndex, itemsCount, items, onItemSelect]
    );

    // hooks
    useStepScrollerGestures(containerRef, items, scrollStep);
    useStepScrollerSync({
        containerRef,
        selectedIndex,
        topIndex,
        setTopIndex,
        itemsCount,
        normalizeIndex: (i) => normalizeIndex(i, itemsCount),
    });

    return (
        <div
            ref={containerRef}
            className="overflow-auto h-[208px] cursor-pointer rounded-sm px-4"
            style={{ scrollBehavior: "smooth", touchAction: "none" }}
        >
            {tripleItems.map((item, i) => {
                // original index in 0..N-1
                const idx = i % itemsCount;
                // position relative to topIndex (distance from center)
                const position = (idx - topIndex + itemsCount) % itemsCount;
                const opacity = getOpacity(position);

                return (
                    <StepScrollerItem
                        key={`${item.id}-${i}`}
                        item={item}
                        opacity={opacity}
                        height={ITEM_HEIGHT}
                        onClick={() => onItemClick?.(item)}
                    />
                );
            })}
        </div>
    );
}
