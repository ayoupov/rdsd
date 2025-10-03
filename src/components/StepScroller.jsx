import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

export default function StepScroller({
                                         items,
                                         selectedIndex = 0,      // controlled initial index from parent (string id index)
                                         onItemSelect,           // called only when user scrolls (not when parent drives selectedIndex)
                                         onItemClick,
                                     }) {
    const containerRef = useRef(null);
    const isMountedRef = useRef(false);

    // Normalize incoming index to valid integer
    const normalizeIndex = (idx) => {
        if (!items || items.length === 0) return 0;
        const n = ((idx % items.length) + items.length) % items.length;
        return n;
    };

    // Initialize internal topIndex from selectedIndex so first render is correct
    const [topIndex, setTopIndex] = useState(() => normalizeIndex(selectedIndex));

    const [scrolling, setScrolling] = useState(false);
    const ITEM_HEIGHT = 46;            // px, must match rendered item height (including margin)
    const ANIM_MS = 200;

    // ---- set initial DOM scroll BEFORE paint (avoid flicker)
    useLayoutEffect(() => {
        const idx = normalizeIndex(selectedIndex);
        setTopIndex(idx); // safe: this sets initial internal state to match prop
        if (containerRef.current) {
            // set scrollTop instantly (no smooth) to avoid visual jump
            containerRef.current.scrollTop = idx * ITEM_HEIGHT;
            console.log(topIndex, containerRef.current.scrollTop, idx * ITEM_HEIGHT);
        }
        // mark mounted; StrictMode may call this twice during dev, but we do not do any destructive side-effects here
        isMountedRef.current = true;
        // run only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- if parent changes selectedIndex after mount, animate to it.
    //      do NOT call onItemSelect here (parent already drove the selection).
    useEffect(() => {
        if (!isMountedRef.current) return; // skip initial mount (already positioned)
        const idx = normalizeIndex(selectedIndex);
        if (idx === topIndex) return;

        setTopIndex(idx);
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
        }
        // do not call onItemSelect here to avoid double-calls
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    // ---- user-driven one-step scroll
    const scrollStep = (delta) => {
        if (scrolling || !items || items.length === 0) return;

        const newIndex = normalizeIndex(topIndex + delta);
        setTopIndex(newIndex);
        setScrolling(true);

        // call parent only for user interactions
        if (onItemSelect) onItemSelect(items[newIndex]);

        if (containerRef.current) {
            containerRef.current.scrollTo({ top: newIndex * ITEM_HEIGHT, behavior: "smooth" });
        }

        setTimeout(() => setScrolling(false), ANIM_MS);
    };

    // ---- wheel handler: attach as non-passive so preventDefault works
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            e.preventDefault(); // block native inertia scrolling
            // one step per event
            scrollStep(e.deltaY > 0 ? 1 : -1);
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [topIndex, scrolling, items]);

    // ---- touch handlers (swipe up/down = one step)
    const touchStartY = useRef(null);
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) touchStartY.current = e.touches[0].clientY;
        };
        const handleTouchEnd = (e) => {
            if (scrolling) return;
            const start = touchStartY.current;
            if (start == null) return;
            const end = e.changedTouches[0].clientY;
            const d = end - start;
            if (Math.abs(d) > 10) {
                scrollStep(d < 0 ? 1 : -1); // swipe up -> step down
            }
            touchStartY.current = null;
        };

        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [topIndex, scrolling, items]);

    const getOpacity = (position) => {
        if (position === 0) return 1;
        if (position === 1) return 0.4;
        return Math.max(0.4 - (position - 1) * 0.1, 0.1);
    };

    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-60 cursor-pointer rounded-xs px-4"
            style={{ scrollBehavior: "smooth", touchAction: "none" }}
        >
            {items.map((item, idx) => {
                const position = (idx - topIndex + items.length) % items.length;
                const opacity = getOpacity(position);

                return (
                    <button
                        key={item.id}
                        className="w-full my-1 px-2 py-3 text-left rounded-lg flex justify-between items-center"
                        style={{
                            backgroundColor: "transparent",
                            color: "#FFFFFF",
                            border: "1px solid rgba(255,255,255,1)",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            textShadow: "0 2px 3px rgba(0,0,0,0.6)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            opacity,
                            height: ITEM_HEIGHT - 2,
                            transition: "opacity 0.15s",
                        }}
                        onClick={() => onItemClick && onItemClick(item)}
                    >
            <span className="overflow-hidden text-ellipsis">
              {item.name} / {item.set_name}
            </span>
                        <span className="ml-2 font-bold" style={{ opacity }}>
              {">"}
            </span>
                    </button>
                );
            })}
        </div>
    );
}
