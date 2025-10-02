import React, { useRef, useState, useEffect } from "react";

export default function StepScroller({ items, selectedIndex = 0, onItemSelect, onItemClick }) {
    const containerRef = useRef(null);
    const [topIndex, setTopIndex] = useState(selectedIndex);
    const [scrolling, setScrolling] = useState(false);

    const ITEM_HEIGHT = 50; // must match button height + margin

    // Wheel or mouse scroll
    const handleWheel = (e) => {
        e.preventDefault();
        scrollStep(e.deltaY > 0 ? 1 : -1);
    };

    // Touch gestures
    const touchStartY = useRef(0);
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

    // Step scroll logic
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

    // Opacity helper
    const getOpacity = (position) => {
        if (position === 0) return 1;
        if (position === 1) return 0.4;
        return Math.max(0.4 - (position - 1) * 0.1, 0.1);
    };

    // Sync topIndex if selectedIndex prop changes (e.g., marker click)
    useEffect(() => {
        if (selectedIndex !== topIndex) {
            scrollStep(selectedIndex - topIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
