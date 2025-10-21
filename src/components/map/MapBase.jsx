import React from "react";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapBase({children, center, zoom = 3 }) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            minZoom={zoom}
            maxZoom={zoom}
            style={{ height: "100%", width: "100%", zIndex: 0, position: "absolute" }}
            worldCopyJump={true}
            maxBoundsViscosity={1.0}
            className="bg-black"
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            dragging={true}
        >
            {children}
        </MapContainer>
    );
}
