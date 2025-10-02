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
          className="overflow-y-auto h-48 cursor-pointer rounded-lg px-[5%]"
      >
        {extendedItems.map((item, idx) => {
          const realIndex = idx % items.length;

          return (
              <button
                  key={`${item.id ?? idx}-${idx}`}
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
                  }}
              >
            <span className="overflow-hidden text-ellipsis">
              {item.name} / {item.set_name}
            </span>
                <span className="ml-2 font-bold">{">"}</span>
              </button>
          );
        })}
      </div>
  );
}
