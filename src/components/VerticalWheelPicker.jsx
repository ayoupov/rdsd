import React, { useRef, useState, useEffect } from "react";

export default function VerticalWheelPicker({ items, onSelect, selectedIndex = 0 }) {
  const containerRef = useRef(null);
  const [topIndex, setTopIndex] = useState(selectedIndex);
  const [scrolling, setScrolling] = useState(false);

  // Snap step height
  const ITEM_HEIGHT = 50; // px, should match your button height + margin

  const handleWheel = (e) => {
    e.preventDefault();
    if (scrolling) return;

    let delta = e.deltaY > 0 ? 1 : -1;
    setScrolling(true);

    let newIndex = (topIndex + delta + items.length) % items.length;
    setTopIndex(newIndex);
    if (onSelect) onSelect(items[newIndex]);

    // Animate scroll
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: newIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }

    setTimeout(() => setScrolling(false), 200); // match animation duration
  };

  const getOpacity = (position) => {
    if (position === 0) return 1;
    if (position === 1) return 0.4;
    return Math.max(0.4 - (position - 1) * 0.1, 0.1);
  };

  return (
      <div
          ref={containerRef}
          onWheel={handleWheel}
          className="overflow-hidden h-48 cursor-pointer rounded-lg px-[5%]"
          style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item, idx) => {
          // Compute virtual position relative to topIndex
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
                    height: ITEM_HEIGHT - 2, // leave margin for my-1
                  }}
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
