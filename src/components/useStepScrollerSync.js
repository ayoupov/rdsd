// components/StepScroller/useStepScrollerSync.js
import { useEffect, useLayoutEffect } from "react";
import { ITEM_HEIGHT } from "./stepScrollerUtils";

export default function useStepScrollerSync({
                                                containerRef,
                                                selectedIndex,
                                                topIndex,
                                                setTopIndex,
                                                normalizeIndex,
                                            }) {
    // Initial mount scroll
    useLayoutEffect(() => {
        const idx = normalizeIndex(selectedIndex);
        setTopIndex(idx);
        if (containerRef.current)
            containerRef.current.scrollTop = idx * ITEM_HEIGHT;
    }, []);

    // External index update
    useEffect(() => {
        const idx = normalizeIndex(selectedIndex);
        if (idx === topIndex) return;

        setTopIndex(idx);
        containerRef.current?.scrollTo({
            top: idx * ITEM_HEIGHT,
            behavior: "smooth",
        });
    }, [selectedIndex, topIndex]);
}
