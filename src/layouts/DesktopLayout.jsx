import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import MapBase from "../components/map/MapBase";
import MapWorldOverlay from "../components/map/MapWorldOverlay";
import MapMarkers from "../components/map/MapMarkers";
import FlyToLocation from "../components/map/FlyToLocation";
import {places} from "../places";


export default function DesktopLayout({onSelectPlace}) {
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
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
            {/* Left: Map */}
            <div className="flex-1 relative">
                <MapBase center={[activePlace.lat, activePlace.lon]}>
                    <MapWorldOverlay/>
                    <MapMarkers
                        places={places}
                        activeId={activePlace?.id}
                        onMarkerClick={onSelectPlace}
                    />
                    <FlyToLocation flyTo={flyTo}/>
                </MapBase>
            </div>

            {/* Right: Info panel */}
            <div className="w-[35%] min-w-[420px] bg-black text-white flex flex-col border-l border-gray-800">
                <div className="flex justify-between items-start p-6">
                    <div>
                        <div className="text-5xl font-bold leading-none tracking-tight">
                            ROADSIDE<br/>PICNIC
                        </div>
                        <p className="mt-3 text-sm text-gray-300 w-64">
                            A remote detour around Unfinished Nuclear Power Plants and their settlements
                        </p>
                    </div>

                    <div className="flex flex-col items-end space-y-1 text-sm">
                        <button className="hover:text-gray-400">About</button>
                        <button className="hover:text-gray-400">Support the project</button>
                        <button className="hover:text-gray-400">INST</button>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mx-6 mb-2"/>

                {/* Scrollable list of places */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                    {places.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => onSelectPlace(p)}
                            className={`block w-full text-left py-2 border-b border-gray-800 hover:text-white ${
                                activePlace?.id === p.id ? "text-white font-semibold" : "text-gray-400"
                            }`}
                        >
                            {p.name.toUpperCase()} / {p.settlement}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
