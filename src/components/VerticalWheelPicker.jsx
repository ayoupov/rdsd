import React, { useRef, useEffect, useState } from "react";

export default function VerticalWheelPicker({ items, onSelect, selectedIndex = 0 }) {
  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const hasMounted = useRef(false);

  const extendedItems = [...items, ...items, ...items];
  const middleStart = items.length;
  const safeSelectedIndex = selectedIndex % items.length;

  // Scroll to middle only on initial mount
  useEffect(() => {
    if (!containerRef.current || hasMounted.current) return;
    const target = containerRef.current.children[middleStart + safeSelectedIndex];
    if (target) {
      containerRef.current.scrollTo({ top: target.offsetTop });
    }
    hasMounted.current = true;
  }, [middleStart, safeSelectedIndex]);

  const isSnappingRef = useRef(false);

  // Snap to topmost button after scroll
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
    scrollTimeout.current = setTimeout(() => {
      snapToTop();
    }, 50);

    if (containerRef.current) {
      setScrollPos(containerRef.current.scrollTop);
    }
  };

  // Compute opacity for visible buttons
  const computeOpacities = () => {
    if (!containerRef.current) return [];

    const children = Array.from(containerRef.current.children);
    const scrollTop = scrollPos;
    const firstVisibleIdx = children.findIndex(
        (c) => c.offsetTop + c.offsetHeight > scrollTop
    );

    return extendedItems.map((_, idx) => {
      const positionFromFirst = idx - firstVisibleIdx;
      if (positionFromFirst === 0) return 1;
      if (positionFromFirst === 1) return 0.4;
      return Math.max(0.4 - (positionFromFirst - 1) * 0.1, 0.1);
    });
  };

  const opacities = computeOpacities();

  return (
      <div
          ref={containerRef}
          onScroll={handleScroll}
          className="overflow-y-auto h-48 cursor-pointer rounded-lg px-[5%]"
      >
        {extendedItems.map((item, idx) => {
          const opacity = opacities[idx] ?? 1;

          return (
              <button
                  key={`${item.id ?? idx}-${idx}`}
                  className="w-full my-1 px-4 py-3 text-left rounded-lg flex justify-between items-center transition-opacity duration-200"
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
