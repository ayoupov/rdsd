import React, {useEffect, useMemo, useRef, useState} from "react";
import Home from "./pages/Home";
import Screen2 from "./pages/Screen2";
import Screen3 from "./pages/Screen3";
import MapScreen from "./pages/MapScreen";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LogoHeader from "./components/LogoHeader.jsx";

export default function App() {
    const containerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrollY, setScrollY] = useState(0);

    const screens = useMemo(
        () => [
            {name: "Home", path: "/", component: <Home/>},
            {name: "Screen2", path: "/landing2", component: <Screen2/>},
            {name: "Screen3", path: "/landing3", component: <Screen3/>},
            {name: "MapScreen", path: "/map", component: <MapScreen/>},
        ],
        []
    );

    const programmaticScrollRef = useRef(false);
    const scrollDebounceRef = useRef(null);
    const lastMapPathRef = useRef("/map");
    const isFirstLoadRef = useRef(true);

    // Fixed image style
    const [imgStyle, setImgStyle] = useState({top: "0px", opacity: 1});

    // Track last Map subroute
    useEffect(() => {
        if (location.pathname.startsWith("/map")) {
            lastMapPathRef.current = location.pathname;
        }
    }, [location.pathname]);

    // Scroll to screen programmatically
    const scrollToScreen = (index) => {
        if (!containerRef.current) return;
        const top = containerRef.current.children[index].offsetTop;

        programmaticScrollRef.current = true;
        containerRef.current.scrollTo({top, behavior: "smooth"});

        const targetPath =
            screens[index].path === "/map" ? lastMapPathRef.current : screens[index].path;

        navigate(targetPath, {replace: true});

        setTimeout(() => {
            programmaticScrollRef.current = false;
        }, 500);

        setMenuOpen(false);
    };

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

        isFirstLoadRef.current = false;

        setTimeout(() => {
            programmaticScrollRef.current = false;
        }, 500);
    }, [location.pathname, screens]);

    // Scroll listener for route sync and image animation
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let rafId = null;

        const onScroll = () => {
            if (programmaticScrollRef.current || isFirstLoadRef.current) return;

            setScrollY(el.scrollTop);

            // Route sync debounce
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
                if (targetPath === "/map") targetPath = lastMapPathRef.current;

                if (location.pathname !== targetPath) {
                    programmaticScrollRef.current = true;
                    navigate(targetPath, {replace: true});
                    setTimeout(() => {
                        programmaticScrollRef.current = false;
                    }, 600);
                }
            }, 120);

            // Image animation
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrollTop = el.scrollTop;
                const screenHeight = el.clientHeight;
                const screenIndex = Math.floor((scrollTop + screenHeight / 2) / screenHeight);

                let top;
                if (screenIndex === 0) {
                    // Home: fixed at bottom with 10% margin
                    const imgEl = document.getElementById("fixed-unpp");
                    const imgHeight = imgEl ? imgEl.offsetHeight : 100;
                    top = `${window.innerHeight * 0.9 - imgHeight}px`;
                } else if (screenIndex === 1 || screenIndex === 2) {
                    // Screens 2 & 3: fixed at 10% from top
                    top = `${window.innerHeight * 0.15}px`;
                } else {
                    // MapScreen: irrelevant (fading out)
                    top = "20px";
                }

                // Opacity fade into MapScreen
                let opacity = 1;
                const fadeStart = screenHeight * 2; // start fading after Screen3
                const fadeEnd = screenHeight * 2.2;
                if (scrollTop > fadeStart) {
                    opacity = scrollTop >= fadeEnd ? 0 : 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
                }

                setImgStyle({top, opacity});
            });
        };

        el.addEventListener("scroll", onScroll, {passive: true});
        return () => {
            el.removeEventListener("scroll", onScroll);
            if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [navigate, location.pathname, screens]);

    // Flip first load flag on first user scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onFirstScroll = () => {
            if (isFirstLoadRef.current) isFirstLoadRef.current = false;
        };
        el.addEventListener("scroll", onFirstScroll, {once: true});
        return () => el.removeEventListener("scroll", onFirstScroll);
    }, []);

    return (
        <div className="relative h-screen w-screen">
            <LogoHeader scrollY={scrollY} scrollToHome={() => scrollToScreen(0)}/>

            {/* UNPP Animation Image */}
            {!location.pathname.startsWith("/map") && (
                <img
                    id="fixed-unpp"
                    src={process.env.PUBLIC_URL + "/img/unpp.gif"}
                    alt="UNPP animation"
                    className="fixed h-auto left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-100"
                    style={{
                        ...imgStyle,
                        width: "80%", // 10% margin on each side
                    }}
                    onLoad={(e) => {
                        const imgHeight = e.target.offsetHeight;
                        setImgStyle((prev) => ({
                            ...prev,
                            top: `${window.innerHeight * 0.9 - imgHeight}px`,
                        }));
                    }}
                />
            )}

            {/* Burger menu */}
            {(containerRef.current ? Math.floor((containerRef.current.scrollTop + containerRef.current.clientHeight / 2) / containerRef.current.clientHeight) !== 0 : false)
                && (<button
                    className="fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-md focus:outline-none"
                    onClick={() => setMenuOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>)}

            {/* Overlay menu */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-8 text-white">
                    {screens.map((screen, idx) => (
                        <button
                            key={idx}
                            className="text-3xl font-bold hover:text-gray-300"
                            onClick={() => scrollToScreen(idx)}
                        >
                            {screen.name}
                        </button>
                    ))}
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                        onClick={() => setMenuOpen(false)}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Scroll container */}
            <div ref={containerRef}
                 className="scroll-container h-screen w-screen overflow-y-scroll scroll-snap-y snap-mandatory">
                {screens.map((screen, idx) => (
                    <div key={idx}
                         className="scroll-screen h-screen w-screen snap-start flex justify-center items-center">
                        {screen.component}
                    </div>
                ))}
            </div>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/screen2" element={<Screen2/>}/>
                <Route path="/screen3" element={<Screen3/>}/>
                <Route path="/map" element={<MapScreen/>}/>
                <Route path="/map/:id" element={<MapScreen/>}/>
            </Routes>
        </div>
    );
}
