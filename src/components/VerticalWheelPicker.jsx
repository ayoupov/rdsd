import React, { useRef, useEffect } from "react";

export default function VerticalWheelPicker({ items, onSelect, selectedIndex = 0 }) {
  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);

  const extendedItems = [...items, ...items, ...items];
  const middleStart = items.length;

  const safeSelectedIndex = selectedIndex % items.length;

  useEffect(() => {
    if (!containerRef.current) return;
    const target = containerRef.current.children[middleStart + safeSelectedIndex];
    if (target) {
      containerRef.current.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    }
  }, [safeSelectedIndex, middleStart]);

  const isSnappingRef = useRef(false);

  const snapToTop = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const children = Array.from(container.children);

    let topIndex = 0;
    let minDiff = Infinity;

    children.forEach((child, idx) => {
      const diff = Math.abs(child.offsetTop - scrollTop);
      if (diff < minDiff) {
        minDiff = diff;
        topIndex = idx;
      }
    });

    const target = children[topIndex];
    const realIndex = ((topIndex - middleStart + items.length) % items.length);

    if (onSelect) onSelect(items[realIndex]);

    // Only snap if user scrolled
    if (target && !isSnappingRef.current) {
      isSnappingRef.current = true;
      container.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      setTimeout(() => {
        isSnappingRef.current = false;
      }, 200);
    }
  };


  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(snapToTop, 150);
  };

  return (
      <div
          ref={containerRef}
          onScroll={handleScroll}
          className="overflow-y-auto h-48 border-t border-b cursor-pointer bg-white/60 backdrop-blur-sm rounded-lg"
      >
        {extendedItems.map((item, idx) => {
          const realIndex = idx % items.length;
          const isSelected = realIndex === safeSelectedIndex;

          return (
              <button
                  key={`${item.id ?? idx}-${idx}`}
                  className={`w-full my-1 px-4 py-3 text-center text-lg rounded-lg ${
                      isSelected
                          ? "bg-blue-500 text-white font-bold"
                          : "bg-white/80 hover:bg-blue-100"
                  }`}
              >
                {item.name}
              </button>
          );
        })}
      </div>
  );
}
