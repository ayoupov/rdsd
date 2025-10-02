import React, { useEffect, useState } from "react";
import { ImageOverlay, MapContainer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import StepScroller from "../components/StepScroller";
import { useNavigate, useParams } from "react-router-dom";
import { places } from "../places";

// Default bounds and latScale
const DEFAULT = { west: -180, east: 180, south: -65, north: 90, latScale: 0.918 };

// Leaflet icons
const defaultIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + "/img/default-pin-shadow.png",
    iconAnchor: [0, 0],
    popupAnchor: [1, -34],
    iconSize: [42, 42],
});

const selectedIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + "/img/active-pin-shadow.png",
    iconAnchor: [0, 0],
    popupAnchor: [1, -34],
    iconSize: [42, 42],
});

// Helper to apply fixed lat scaling
const applyLatScale = (lat) => {
    const center = (DEFAULT.south + DEFAULT.north) / 2;
    return center + (lat - center) * DEFAULT.latScale;
};

// FlyTo component
function FlyToLocation({ flyTo }) {
    const map = useMap();
    useEffect(() => {
        if (flyTo?.length === 2) map.flyTo(flyTo, 4);
    }, [flyTo, map]);
    return null;
}

export default function MapScreen() {
    const params = useParams();
    const navigate = useNavigate();
    const id = params.id ? Number(params.id) : places[0].id;

    // Precompute scaledLat for all places
    const scaledPlaces = places.map((p) => ({
        ...p,
        scaledLat: applyLatScale(p.lat),
    }));

    const initialPlace = scaledPlaces.find((p) => p.id === id) || scaledPlaces[0];

    const [activePlace, setActivePlace] = useState(initialPlace);
    const [flyTo, setFlyTo] = useState([initialPlace.scaledLat, initialPlace.lon]);
    const [selectedIndex, setSelectedIndex] = useState(
        scaledPlaces.findIndex((p) => p.id === id)
    );

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [isClosing, setIsClosing] = useState(false);

    // Sync active place when route param changes
    useEffect(() => {
        const newPlace = scaledPlaces.find((p) => p.id === id);
        if (newPlace) {
            setActivePlace(newPlace);
            setFlyTo([newPlace.scaledLat, newPlace.lon]);
            setSelectedIndex(scaledPlaces.findIndex((p) => p.id === id));
        }
    }, [id]);

    // Handle selecting an item from scroller (highlight marker)
    const handleItemSelect = (place) => {
        setActivePlace(place);
        setFlyTo([place.scaledLat, place.lon]);
        setSelectedIndex(scaledPlaces.findIndex((p) => p.id === place.id));
    };

    // Handle clicking a scroller item (open popup)
    const handleItemClick = (place) => {
        setSelectedPlace(place);
        setActiveTab("info");
        setIsClosing(false);
    };

    // Handle marker click (scroll scroller)
    const handleMarkerClick = (place) => {
        const index = scaledPlaces.findIndex((p) => p.id === place.id);
        setSelectedIndex(index); // StepScroller will scroll to top
        setActivePlace(place);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedPlace(null);
            setIsClosing(false);
        }, 400);
    };

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

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={[initialPlace.scaledLat, initialPlace.lon]}
                minZoom={5}
                zoom={5}
                maxZoom={5}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", zIndex: 0, position: "absolute" }}
                worldCopyJump={true}
                maxBounds={mainBounds}
                maxBoundsViscosity={1.0}
                className="bg-black"
                zoomControl={false}
                attributionControl={false}
            >
                <ImageOverlay url={process.env.PUBLIC_URL + "/img/world.png"} bounds={mainBounds} />
                <ImageOverlay url={process.env.PUBLIC_URL + "/img/world.png"} bounds={leftBounds} />
                <ImageOverlay url={process.env.PUBLIC_URL + "/img/world.png"} bounds={rightBounds} />

                {scaledPlaces.map((place) => (
                    <Marker
                        key={place.id}
                        position={[place.scaledLat, place.lon]}
                        icon={activePlace.id === place.id ? selectedIcon : defaultIcon}
                        eventHandlers={{ click: () => handleMarkerClick(place) }}
                    />
                ))}

                <FlyToLocation flyTo={flyTo} />
            </MapContainer>

            <div className="absolute bottom-0 w-full">
                <StepScroller
                    items={scaledPlaces}
                    selectedIndex={selectedIndex}
                    onItemSelect={handleItemSelect}
                    onItemClick={handleItemClick}
                />
            </div>

            {selectedPlace && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-[90vw] max-w-md h-[90vh] rounded-lg p-4 transition-transform transition-opacity duration-400 ease-out"
                        style={{
                            transform: isClosing ? "translateX(-100%)" : "translateX(0)",
                            opacity: isClosing ? 0 : 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex mb-2">
                            <button
                                className={`flex-1 p-2 border ${
                                    activeTab === "info" ? "bg-gray-300" : "bg-white"
                                } cursor-pointer`}
                                onClick={() => setActiveTab("info")}
                            >
                                Info
                            </button>
                            <button
                                className={`flex-1 p-2 border ${
                                    activeTab === "details" ? "bg-gray-300" : "bg-white"
                                } cursor-pointer`}
                                onClick={() => setActiveTab("details")}
                            >
                                Details
                            </button>
                        </div>

                        <div className={`transition-opacity duration-300 ${activeTab === "info" ? "opacity-100" : "opacity-0"}`}>
                            <p><strong>Name:</strong> {selectedPlace.name}</p>
                            <p><strong>City:</strong> {selectedPlace.city}</p>
                        </div>
                        <div className={`transition-opacity duration-300 ${activeTab === "details" ? "opacity-100" : "opacity-0"}`}>
                            <p><strong>Population:</strong> {selectedPlace.population || "N/A"}</p>
                            <p><strong>Notes:</strong> {selectedPlace.notes || "-"}</p>
                        </div>

                        <button className="mt-4 p-2 border bg-gray-200 rounded" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
