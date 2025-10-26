// components/StepScroller/stepScrollerUtils.js

export const ITEM_HEIGHT = 52;
export const ANIM_MS = 200;

export const normalizeIndex = (idx, length) =>
    ((idx % length) + length) % length;

export const getOpacity = (position) => {
    if (position === 0) return 1;
    if (position === 1) return 0.4;
    return Math.max(0.4 - (position - 1) * 0.1, 0.1);
};
