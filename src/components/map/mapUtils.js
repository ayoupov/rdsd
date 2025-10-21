export const DEFAULT = { west: -180, east: 180, south: -65, north: 90, latScale: 0.918 };

export const applyLatScale = (lat) => {
    const center = (DEFAULT.south + DEFAULT.north) / 2;
    return center + (lat - center) * DEFAULT.latScale;
};
