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
    const [activeTab, setActiveTab] = useState("unpp");
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
        setActiveTab("unpp");
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
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-full max-w-md min-h-screen rounded-none p-4 shadow-xl relative transition-transform transition-opacity duration-400 ease-out"
                        style={{
                            transform: isClosing ? "translateX(-100%)" : "translateX(0)",
                            opacity: isClosing ? 0 : 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button top-left */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 left-4 p-2 text-gray-700 hover:text-black"
                            aria-label="Close"
                        >
                            ←
                        </button>

                        {/* Tabs Header */}
                        <div className="flex mb-4 border-b border-gray-300">
                            <button
                                className={`flex-1 py-2 text-center font-semibold transition-colors ${
                                    activeTab === "unpp" ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-50"
                                }`}
                                onClick={() => setActiveTab("unpp")}
                            >
                                {selectedPlace.name}
                            </button>
                            <button
                                className={`flex-1 py-2 text-center font-semibold transition-colors ${
                                    activeTab === "set" ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-50"
                                }`}
                                onClick={() => setActiveTab("set")}
                            >
                                {selectedPlace.set_name}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {/* UNPP Tab */}
                            {activeTab === "unpp" && (
                                <div className="transition-opacity duration-300 opacity-100">
                                    {selectedPlace.img_name && (
                                        <img
                                            src={process.env.PUBLIC_URL + "/img/IMG_UNPP/" + selectedPlace.img_name + ".png"}
                                            alt={selectedPlace.name}
                                            className="w-full h-auto object-contain rounded-lg mb-4"
                                        />
                                    )}

                                    <table className="w-full text-left mb-4">
                                        <tbody>
                                        <tr>
                                            <td className="font-semibold pr-2">Construction: {selectedPlace.construction_years || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-2">Planned: {selectedPlace.planned || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-2">Status: {selectedPlace.status || "N/A"}</td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <p className="text-gray-700">{selectedPlace.description}</p>
                                </div>
                            )}

                            {/* Set Tab */}
                            {activeTab === "set" && (
                                <div className="transition-opacity duration-300 opacity-100">
                                    {selectedPlace.set_id && (
                                        <img
                                            src={process.env.PUBLIC_URL + "/img/IMG_SETTLEMENT/" + selectedPlace.set_id + "_MAP.png"}
                                            alt={selectedPlace.name + " settlement"}
                                            className="w-full h-auto object-contain rounded-lg mb-4"
                                        />
                                    )}

                                    <table className="w-full text-left mb-4">
                                        <tbody>
                                        <tr>
                                            <td className="font-semibold pr-2">Est.: {selectedPlace.set_est || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-2">Planned population: {selectedPlace.set_planned_pop || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-2">Current population: {selectedPlace.set_cur_pop || "N/A"}</td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <p className="text-gray-700">{selectedPlace.set_description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
