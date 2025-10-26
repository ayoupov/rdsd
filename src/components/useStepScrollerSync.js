// components/StepScroller/useStepScrollerSync.js
import { useEffect, useLayoutEffect, useRef } from "react";
import { ITEM_HEIGHT } from "./stepScrollerUtils";

/**
 * sync hook for infinite scroller:
 * - initially scroll to middle copy (selectedIndex + N) * ITEM_HEIGHT
 * - when parent changes selectedIndex, scroll to middle copy
 * - listen for native scroll and auto-recenter if user reaches outer copies
 */
export default function useStepScrollerSync({
                                                containerRef,
                                                selectedIndex,
                                                topIndex,
                                                setTopIndex,
                                                itemsCount,
                                                normalizeIndex,
                                            }) {
    const guardRef = useRef(false);
    const debounceRef = useRef(null);

    // initial mount: position in middle copy
    useLayoutEffect(() => {
        const idx = normalizeIndex(selectedIndex);
        setTopIndex(idx);
        if (containerRef.current) {
            // middle copy offset = itemsCount
            containerRef.current.scrollTop = (idx + itemsCount) * ITEM_HEIGHT;
        }
        guardRef.current = true;
    }, []);

    // external selectedIndex update: scroll to middle copy position
    useEffect(() => {
        if (!guardRef.current) return;
        const idx = normalizeIndex(selectedIndex);
        setTopIndex(idx);
        containerRef.current?.scrollTo({
            top: (idx + itemsCount) * ITEM_HEIGHT,
            behavior: "smooth",
        });
    }, [selectedIndex]);

    // watch native scrolling and recenter if necessary
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            // debounce evaluation to avoid jank while scrolling
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                const total = itemsCount;
                const scrollTop = el.scrollTop;
                const curIndex = Math.round(scrollTop / ITEM_HEIGHT); // index within tripled list
                // if we are outside middle copy, jump to equivalent index in middle copy
                if (curIndex < total || curIndex >= total * 2) {
                    const normalized = normalizeIndex(curIndex, total);
                    const newScroll = (normalized + total) * ITEM_HEIGHT;
                    // jump without animation to avoid user noticing
                    el.scrollTop = newScroll;
                    setTopIndex(normalized);
                } else {
                    // update topIndex from middle copy position
                    const normalized = normalizeIndex(curIndex - total, total);
                    setTopIndex(normalized);
                }
            }, 80);
        };

        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            el.removeEventListener("scroll", handleScroll);
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [itemsCount]);
}
