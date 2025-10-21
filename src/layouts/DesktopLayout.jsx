import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapScreen from "../pages/MapScreen";
import Home from "../pages/Home";
import Screen2 from "../pages/Screen2";
import Screen3 from "../pages/Screen3";
import LogoHeader from "../components/LogoHeader";
import OverlayMenu from "../components/OverlayMenu";
import AboutModal from "../components/AboutModal";
import SupportModal from "../components/SupportModal";
import BurgerMenu from "../components/BurgerMenu";

export default function DesktopLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = React.useState(false);
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [supportOpen, setSupportOpen] = React.useState(false);

    // Define sections for desktop (side-by-side layout)
    const sections = [
        { name: "Home", path: "/", component: <Home /> },
        { name: "Screen2", path: "/landing2", component: <Screen2 /> },
        { name: "Screen3", path: "/landing3", component: <Screen3 /> },
        { name: "MapScreen", path: "/map", component: <MapScreen /> },
    ];

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            {/* Header */}
            <LogoHeader
                scrollY={0}
                scrollToHome={() => navigate("/")}
            />

            {/* Burger for desktop menu */}
            <BurgerMenu show={true} onClick={() => setMenuOpen(true)} />

            {/* Overlay menu + modals */}
            {menuOpen && (
                <OverlayMenu
                    closeMenu={() => setMenuOpen(false)}
                    openAbout={() => {
                        setMenuOpen(false);
                        setAboutOpen(true);
                    }}
                    openSupport={() => {
                        setMenuOpen(false);
                        setSupportOpen(true);
                    }}
                />
            )}
            {aboutOpen && <AboutModal closeModal={() => setAboutOpen(false)} />}
            {supportOpen && <SupportModal closeModal={() => setSupportOpen(false)} />}

            {/* Main layout */}
            <main className="flex flex-row flex-1 overflow-hidden">
                {/* Left side: static image or hero content */}
                <div className="w-1/2 h-full flex justify-center items-center bg-gray-50">
                    <img
                        src={process.env.PUBLIC_URL + "/img/unpp.gif"}
                        alt="UNPP animation"
                        className="max-w-[480px] w-full object-contain"
                    />
                </div>

                {/* Right side: scrollable content */}
                <div className="w-1/2 h-screen overflow-y-auto">
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            className="min-h-screen flex justify-center items-center border-b border-gray-100"
                        >
                            {section.component}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
