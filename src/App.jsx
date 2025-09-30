import React, { useRef, useState, useEffect, useMemo } from "react";
import Home from "./pages/Home";
import Screen2 from "./pages/Screen2";
import Screen3 from "./pages/Screen3";
import MapScreen from "./pages/MapScreen";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import LogoHeader from "./components/LogoHeader.jsx"

export default function App() {
    const containerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrollY, setScrollY] = useState(0);

    const screens = useMemo(() => [
        { name: "Home", path: "/", component: <Home /> },
        { name: "Screen2", path: "/screen2", component: <Screen2 /> },
        { name: "Screen3", path: "/screen3", component: <Screen3 /> },
        { name: "MapScreen", path: "/map", component: <MapScreen /> },
    ], []);

    const programmaticScrollRef = useRef(false);
    const scrollDebounceRef = useRef(null);

    // Store last visited map subroute
    const lastMapPathRef = useRef("/map");

    useEffect(() => {
        if (location.pathname.startsWith("/map")) {
            lastMapPathRef.current = location.pathname; // e.g. "/map/42"
        }
    }, [location.pathname]);

    const scrollToScreen = (index) => {
        if (!containerRef.current) return;
        const top = containerRef.current.children[index].offsetTop;

        programmaticScrollRef.current = true;
        containerRef.current.scrollTo({ top, behavior: "smooth" });

        // if MapScreen → use last visited map subroute
        const targetPath =
            screens[index].path === "/map" ? lastMapPathRef.current : screens[index].path;

        navigate(targetPath, { replace: true });

        window.setTimeout(() => {
            programmaticScrollRef.current = false;
        }, 700);

        setMenuOpen(false);
    };

    const isFirstLoadRef = useRef(true);

    // Sync scroll on route change
    useEffect(() => {
        let normalized = location.pathname;
        if (location.pathname.startsWith("/map")) normalized = "/map";

        const idx = screens.findIndex((s) => s.path === normalized);
        if (idx === -1 || !containerRef.current) return;

        if (programmaticScrollRef.current) {
            programmaticScrollRef.current = false;
            return;
        }

        programmaticScrollRef.current = true;
        const top = containerRef.current.children[idx].offsetTop;

        containerRef.current.scrollTo({
            top,
            behavior: isFirstLoadRef.current ? "auto" : "smooth",
        });

        // after first render, disable instant mode
        isFirstLoadRef.current = false;

        const t = window.setTimeout(() => {
            programmaticScrollRef.current = false;
            clearTimeout(t);
        }, 700);
    }, [location.pathname, screens]);

    // Sync route on scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onScroll = () => {
            if (programmaticScrollRef.current) return;
            setScrollY(containerRef.current.scrollTop); // <-- update scrollY

            if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
            scrollDebounceRef.current = setTimeout(() => {
                const scrollPos = el.scrollTop;
                const children = Array.from(el.children);

                let closestIdx = 0;
                let closestDist = Infinity;
                children.forEach((child, idx) => {
                    const dist = Math.abs(child.offsetTop - scrollPos);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIdx = idx;
                    }
                });

                let targetPath = screens[closestIdx].path;
                if (targetPath === "/map") {
                    targetPath = lastMapPathRef.current; // preserve last /map/:id
                }

                if (location.pathname !== targetPath) {
                    programmaticScrollRef.current = true;
                    navigate(targetPath, { replace: true });
                    window.setTimeout(() => {
                        programmaticScrollRef.current = false;
                    }, 800);
                }
            }, 120);
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            el.removeEventListener("scroll", onScroll);
            if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
        };
    }, [navigate, location.pathname, screens]);

    return (
        <div className="relative h-screen w-screen">

            <LogoHeader scrollY={scrollY} scrollToHome={() => scrollToScreen(0)}/>

            {/* Burger menu */}
            <button
                className="fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-md focus:outline-none"
                onClick={() => setMenuOpen(true)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-8 text-white">
                    {screens.map((screen, idx) => (
                        <button key={idx} className="text-3xl font-bold hover:text-gray-300" onClick={() => scrollToScreen(idx)}>
                            {screen.name}
                        </button>
                    ))}
                    <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={() => setMenuOpen(false)}>
                        ×
                    </button>
                </div>
            )}

            {/* Scroll container */}
            <div
                ref={containerRef}
                className="scroll-container h-screen w-screen overflow-y-scroll scroll-snap-y snap-mandatory"
            >
                {screens.map((screen, idx) => (
                    <div key={idx} className="scroll-screen h-screen w-screen snap-start flex justify-center items-center">
                        {screen.component}
                    </div>
                ))}
            </div>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/screen2" element={<Screen2 />} />
                <Route path="/screen3" element={<Screen3 />} />
                <Route path="/map" element={<MapScreen />} />
                <Route path="/map/:id" element={<MapScreen />} />
            </Routes>
        </div>
    );
}
