import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

const defaultIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + "/img/default-pin-shadow.png",
    iconAnchor: [21, 21],
    popupAnchor: [0, -21],
    iconSize: [42, 42],
});

const selectedIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + "/img/active-pin-shadow.png",
    iconAnchor: [21, 21],
    popupAnchor: [0, -21],
    iconSize: [42, 42],
});

export default function MapMarkers({ places, activeId, onMarkerClick }) {
    return (
        <>
            {places.map((place) => (
                <Marker
                    key={place.id}
                    position={[place.lat, place.lon]}
                    icon={activeId === place.id ? selectedIcon : defaultIcon}
                    eventHandlers={{ click: () => onMarkerClick(place) }}
                />
            ))}
        </>
    );
}
