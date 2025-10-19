import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import StepScrollerItem from "./StepScrollerItem";

export default function StepScroller({ items, selectedIndex = 0, onItemSelect, onItemClick }) {
    const containerRef = useRef(null);
    const isMountedRef = useRef(false);

    const ITEM_HEIGHT = 44;
    const ANIM_MS = 200;

    const normalizeIndex = (idx) => ((idx % items.length) + items.length) % items.length;
    const [topIndex, setTopIndex] = useState(() => normalizeIndex(selectedIndex));
    const [scrolling, setScrolling] = useState(false);

    const gestureActive = useRef(false);
    const wheelTimeout = useRef(null);
    const touchTimeout = useRef(null);
    const touchStartY = useRef(null);
    const lastGestureTime = useRef(0);

    // ---- scroll one step
    const scrollStep = (delta) => {
        if (!items || items.length === 0) return;

        const newIndex = normalizeIndex(topIndex + delta);
        setTopIndex(newIndex);
        setScrolling(true);

        if (onItemSelect) onItemSelect(items[newIndex]);

        if (containerRef.current) {
            containerRef.current.scrollTo({ top: newIndex * ITEM_HEIGHT, behavior: "smooth" });
        }

        setTimeout(() => {
            setScrolling(false);
        }, ANIM_MS);
    };

    // ---- wheel handling
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            e.preventDefault();
            const now = performance.now();

            if (now < lastGestureTime.current) return;

            if (!gestureActive.current) {
                gestureActive.current = true;
                scrollStep(e.deltaY > 0 ? 1 : -1);
            }

            if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
            wheelTimeout.current = setTimeout(() => {
                gestureActive.current = false;
                lastGestureTime.current = performance.now();
            }, 100);
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [topIndex, items]);

    // ---- touch handling
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            if (touchStartY.current == null) return;
            const delta = e.changedTouches[0].clientY - touchStartY.current;

            if (Math.abs(delta) > 20 && !gestureActive.current) {
                gestureActive.current = true;
                scrollStep(delta < 0 ? 1 : -1);
            }

            if (touchTimeout.current) clearTimeout(touchTimeout.current);
            touchTimeout.current = setTimeout(() => {
                gestureActive.current = false;
            }, 100);

            touchStartY.current = null;
        };

        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [topIndex, items]);

    // ---- initial scroll
    useLayoutEffect(() => {
        const idx = normalizeIndex(selectedIndex);
        setTopIndex(idx);
        if (containerRef.current) containerRef.current.scrollTop = idx * ITEM_HEIGHT;
        isMountedRef.current = true;
    }, []);

    // ---- parent-driven update
    useEffect(() => {
        if (!isMountedRef.current) return;
        const idx = normalizeIndex(selectedIndex);
        if (idx === topIndex) return;

        setTopIndex(idx);
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
        }
    }, [selectedIndex]);

    const getOpacity = (position) => {
        if (position === 0) return 1;
        if (position === 1) return 0.4;
        return Math.max(0.4 - (position - 1) * 0.1, 0.1);
    };

    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-60 cursor-pointer rounded-sm px-4"
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
                        onClick={() => onItemClick && onItemClick(item)}
                    />
                );
            })}
        </div>
    );
}
