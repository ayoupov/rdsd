// components/StepScroller/useStepScrollerGestures.js
import { useEffect, useRef } from "react";
import { ANIM_MS } from "./stepScrollerUtils";

export default function useStepScrollerGestures(containerRef, items, scrollStep) {
    const gestureActive = useRef(false);
    const wheelTimeout = useRef(null);
    const touchTimeout = useRef(null);
    const touchStartY = useRef(null);
    const lastGestureTime = useRef(0);

    // Wheel
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

            clearTimeout(wheelTimeout.current);
            wheelTimeout.current = setTimeout(() => {
                gestureActive.current = false;
                lastGestureTime.current = performance.now() + ANIM_MS;
            }, 100);
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [items, scrollStep]);

    // Touch
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleTouchStart = (e) => {
            if (e.touches.length === 1)
                touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            const startY = touchStartY.current;
            if (startY == null) return;

            const delta = e.changedTouches[0].clientY - startY;

            if (Math.abs(delta) > 20 && !gestureActive.current) {
                gestureActive.current = true;
                scrollStep(delta < 0 ? 1 : -1);
            }

            clearTimeout(touchTimeout.current);
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
    }, [items, scrollStep]);
}
