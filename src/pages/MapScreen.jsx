import React, { useEffect, useState } from "react";
import { ImageOverlay, MapContainer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import StepScroller from "../components/StepScroller";
import PlaceModal from "../components/PlaceModal";
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
    const id = params.id || places[0].id;

    // Precompute scaledLat for all places
    const scaledPlaces = places.map((p) => ({
        ...p,
        scaledLat: applyLatScale(p.lat),
    }));

    const initialPlace = scaledPlaces.find((p) => p.id === id);

    const [activePlace, setActivePlace] = useState(scaledPlaces.findIndex((p) => p.id === id));
    const [flyTo, setFlyTo] = useState([initialPlace.scaledLat, initialPlace.lon]);
    const [selectedIndex, setSelectedIndex] = useState(
        scaledPlaces.findIndex((p) => p.id === id)
    );

    const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);
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
        navigate(`/map/${place.id}`);
    };

    // Handle clicking a scroller item (open popup)
    const handleItemClick = (place) => {
        setSelectedPlaceForModal(place);
        setActiveTab("unpp");
        setIsClosing(false);
        navigate(`/map/${place.id}`);
    };

    // Handle marker click (scroll scroller)
    const handleMarkerClick = (place) => {
        const index = scaledPlaces.findIndex((p) => p.id === place.id);
        setSelectedIndex(index); // StepScroller will scroll to top
        setActivePlace(place);
        navigate(`/map/${place.id}`);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedPlaceForModal(null);
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

            <PlaceModal
                selectedPlace={selectedPlaceForModal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                closeModal={closeModal}
                isClosing={isClosing}
            />


        </div>
    );
}
