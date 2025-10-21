import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { places } from "../places";

import MapBase from "../components/map/MapBase";
import MapWorldOverlay from "../components/map/MapWorldOverlay";
import MapMarkers from "../components/map/MapMarkers";
import FlyToLocation from "../components/map/FlyToLocation";

import StepScroller from "../components/StepScroller";
import PlaceModal from "../components/PlaceModal";

export default function MapScreen() {
    const location = useLocation();
    const navigate = useNavigate();

    const [id, setId] = useState(places[0].id);
    const [activePlace, setActivePlace] = useState(places[0]);
    const [flyTo, setFlyTo] = useState([places[0].lat, places[0].lon]);
    const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("unpp");
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const parts = location.pathname.split("/");
        if (parts[1] === "map" && parts[2]) {
            const found = places.find((p) => p.id === parts[2]);
            if (found) {
                setId(found.id);
                setActivePlace(found);
                setFlyTo([found.lat, found.lon]);
                setSelectedIndex(places.findIndex((p) => p.id === found.id));
            }
        }
    }, [location]);

    const handleItemSelect = (place) => {
        setActivePlace(place);
        setFlyTo([place.lat, place.lon]);
        setSelectedIndex(places.findIndex((p) => p.id === place.id));
        navigate(`/map/${place.id}`);
    };

    const handleItemClick = (place) => {
        setSelectedPlaceForModal(place);
        setActiveTab("unpp");
        setIsClosing(false);
        navigate(`/map/${place.id}`);
    };

    const handleMarkerClick = (place) => {
        const index = places.findIndex((p) => p.id === place.id);
        setSelectedIndex(index);
        setActivePlace(place);
        navigate(`/map/${place.id}`);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedPlaceForModal(null);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className="w-full h-full relative">
            <MapBase center={[activePlace.lat, activePlace.lon]}>
                <MapWorldOverlay />
                <MapMarkers
                    places={places}
                    activeId={activePlace.id}
                    onMarkerClick={handleMarkerClick}
                />
                <FlyToLocation flyTo={flyTo} />
            </MapBase>

            <div className="absolute bottom-0 w-full">
                <StepScroller
                    items={places}
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
