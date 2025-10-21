import React from "react";
import { ImageOverlay } from "react-leaflet";
import { DEFAULT, applyLatScale } from "./mapUtils";

export default function MapWorldOverlay() {
    const mainBounds = [
        [applyLatScale(DEFAULT.south), DEFAULT.west],
        [applyLatScale(DEFAULT.north), DEFAULT.east],
    ];
    const leftBounds = [
        [mainBounds[0][0], -540],
        [mainBounds[1][0], -180],
    ];
    const rightBounds = [
        [mainBounds[0][0], 180],
        [mainBounds[1][0], 540],
    ];

    const world = process.env.PUBLIC_URL + "/img/world.png";

    return (
        <>
            <ImageOverlay url={world} bounds={mainBounds} />
            <ImageOverlay url={world} bounds={leftBounds} />
            <ImageOverlay url={world} bounds={rightBounds} />
        </>
    );
}
