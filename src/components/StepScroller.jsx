import React, { useRef, useState, useCallback } from "react";
import StepScrollerItem from "./StepScrollerItem";
import useStepScrollerGestures from "./useStepScrollerGestures";
import useStepScrollerSync from "./useStepScrollerSync";
import {
    ITEM_HEIGHT,
    ANIM_MS,
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
    const [topIndex, setTopIndex] = useState(() =>
        normalizeIndex(selectedIndex, items.length)
    );

    const scrollStep = useCallback(
        (delta) => {
            const newIndex = normalizeIndex(topIndex + delta, items.length);
            setTopIndex(newIndex);
            onItemSelect?.(items[newIndex]);

            containerRef.current?.scrollTo({
                top: newIndex * ITEM_HEIGHT,
                behavior: "smooth",
            });
        },
        [topIndex, items]
    );

    useStepScrollerGestures(containerRef, items, scrollStep);

    useStepScrollerSync({
        containerRef,
        selectedIndex,
        topIndex,
        setTopIndex,
        normalizeIndex: (i) => normalizeIndex(i, items.length),
    });

    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-[208px] cursor-pointer rounded-sm px-4"
            style={{ scrollBehavior: "smooth", touchAction: "none" }}
        >
            {items.map((item, idx) => {
                const position = (idx - topIndex + items.length) % items.length;
                const opacity = getOpacity(position);

                return (
                    <StepScrollerItem
                        key={item.id}
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
