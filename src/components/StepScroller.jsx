import React, { useRef, useState, useEffect } from "react";

export default function StepScroller({ items, selectedIndex = 0, onItemSelect, onItemClick }) {
    const containerRef = useRef(null);
    const [topIndex, setTopIndex] = useState(selectedIndex);
    const [scrolling, setScrolling] = useState(false);

    const ITEM_HEIGHT = 50;

    const touchStartY = useRef(0);

    const scrollStep = (delta) => {
        if (scrolling) return;

        let newIndex = (topIndex + delta + items.length) % items.length;
        setTopIndex(newIndex);
        setScrolling(true);

        if (onItemSelect) onItemSelect(items[newIndex]);

        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: newIndex * ITEM_HEIGHT,
                behavior: "smooth",
            });
        }

        setTimeout(() => setScrolling(false), 200);
    };

    // Wheel handler (step scroll)
    const handleWheel = (e) => {
        e.preventDefault();
        scrollStep(e.deltaY > 0 ? 1 : -1);
    };

    // Touch handlers
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (scrolling) return;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(deltaY) > 10) {
            scrollStep(deltaY < 0 ? 1 : -1); // swipe up = scroll down
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Add wheel listener with passive: false
        el.addEventListener("wheel", handleWheel, { passive: false });

        // Add touch listeners (passive default is fine)
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [topIndex, scrolling]);

    const getOpacity = (position) => {
        if (position === 0) return 1;
        if (position === 1) return 0.4;
        return Math.max(0.4 - (position - 1) * 0.1, 0.1);
    };

    useEffect(() => {
        if (selectedIndex !== topIndex) {
            scrollStep(selectedIndex - topIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-60 cursor-pointer rounded-lg px-[5%]"
            style={{ scrollBehavior: "smooth" }}
        >
            {items.map((item, idx) => {
                let position = (idx - topIndex + items.length) % items.length;
                let opacity = getOpacity(position);

                return (
                    <button
                        key={item.id}
                        className="w-full my-1 px-4 py-3 text-left rounded-lg flex justify-between items-center"
                        style={{
                            backgroundColor: "transparent",
                            color: "#FFFFFF",
                            border: "1px solid rgba(255,255,255,0.5)",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            opacity: opacity,
                            height: ITEM_HEIGHT - 2,
                        }}
                        onClick={() => onItemClick(item)}
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
