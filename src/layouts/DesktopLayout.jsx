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

    const [currentSlide, setCurrentSlide] = useState(0);

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

    const carouselTexts = [
        "A remote detour around Unfinished Nuclear Power Plants and their settlements.",
        "There are 27 Unfinished Nuclear Power Plants worldwide, some requiring dedicated settlements for workers with families — nearly half a million people bound to projects that never reached completion.",
        "This project explores 13 communities inhabiting the periphery of the modern built environment after their dream of living in the center of the modern technology failed."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselTexts.length);
        }, 8000); // change slide every 8 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
            {/* Left: Map */}
            <div className="flex-1 relative">
                <MapBase center={[activePlace.lat, activePlace.lon]}>
                    <MapWorldOverlay/>
                    <MapMarkers
                        places={places}
                        activeId={activePlace?.id}
                        onMarkerClick={handleMarkerClick}
                    />
                    <FlyToLocation flyTo={flyTo}/>
                </MapBase>
            </div>

            {/* Right: Info panel */}
            <div className="w-[35%] min-w-[420px] bg-black text-white flex flex-col border-l border-gray-800">
                <div className="flex items-start p-6 relative">
                    {/* Menu buttons */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between w-full px-6 pt-[16px] mb-[24px]">
                        <button className="hover:text-[#6A6A6A]">About</button>
                        <button className="hover:text-[#6A6A6A]">Support the project</button>
                        <button className="underline hover:text-[#6A6A6A]">INST</button>
                    </div>

                    {/* Logo + description */}
                    <div className="flex flex-col items-center w-full mt-[24px]">
                        <img
                            src={process.env.PUBLIC_URL + "/img/logo-white.svg"}
                            alt="Logo"
                            className="block"
                            style={{
                                width: `358px`,
                                height: `173px`,
                                objectFit: "contain",
                                maxWidth: "none",
                            }}
                        />
                        <div className="mt-3 h-[144px] overflow-hidden relative w-full text-center">
                            {carouselTexts.map((text, index) => (
                                <div
                                    key={index}
                                    className={`absolute top-0 left-0 w-full transition-opacity duration-500 text-[18px] text-[#6A6A6A] ${
                                        index === currentSlide ? "opacity-100" : "opacity-0"
                                    }`}
                                >
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scrollable list of places */}
                <div className="flex-1 flex flex-col justify-end overflow-y-auto px-[16px] pb-6 mv-[20px] custom-scrollbar">
                    {places.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => onSelectPlace(p)}
                            className={`
                        w-full px-[16px] my-[4px] text-left rounded-lg flex justify-between items-center hover:text-[#CDCDCD]
                        ${activePlace?.id === p.id ? "text-[#CDCDCD]" : "text-[#6A6A6A]"}
                        `}
                            style={{
                                backgroundColor: "transparent",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                // height: height,
                                transition: "opacity 0.15s",
                            }}
                        >
                          <span className="overflow-hidden text-ellipsis">
                            {p.name} / {p.set_name}
                          </span>
                            <span className="ml-2" style={{display: "flex", alignItems: "center"}}>
                            <svg width="9" height="14" viewBox="0 0 9 14" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0 L9 7 L0 14" stroke="white" strokeWidth="2"/>
                            </svg>
                          </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
