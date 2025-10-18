import React, {useEffect, useMemo, useRef, useState} from "react";
import Home from "./pages/Home";
import Screen2 from "./pages/Screen2";
import Screen3 from "./pages/Screen3";
import MapScreen from "./pages/MapScreen";
import {useLocation, useNavigate} from "react-router-dom";
import LogoHeader from "./components/LogoHeader.jsx";
import OverlayMenu from "./components/OverlayMenu.jsx";
import AboutModal from "./components/AboutModal.jsx";
import SupportModal from "./components/SupportModal.jsx";

export default function App() {
    const containerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrollY, setScrollY] = useState(0);
    const [screen2Opacity, setScreen2Opacity] = useState(1);
    const [screen3Opacity, setScreen3Opacity] = useState(1);

    const programmaticScrollRef = useRef(false);
    const scrollDebounceRef = useRef(null);
    const lastMapPathRef = useRef("/map");
    const isFirstLoadRef = useRef(true);
    const imageRef = useRef(null);

    // Screens
    const screens = useMemo(
        () => [
            {name: "Home", path: "/", component: <Home/>},
            {name: "Screen2", path: "/landing2", component: <Screen2/>},
            {name: "Screen3", path: "/landing3", component: <Screen3/>},
            {name: "MapScreen", path: "/map", component: <MapScreen/>},
        ],
        []
    );

    // UNPP image state
    const imgHeightRef = useRef(0);
    const [imgStyle, setImgStyle] = useState({top: "0px", opacity: 1});
    const [imgReady, setImgReady] = useState(false);

    // Track last map subroute
    useEffect(() => {
        if (location.pathname.startsWith("/map")) {
            lastMapPathRef.current = location.pathname;
        }
    }, [location.pathname]);

    // Programmatic scroll to screen
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

    // Sync scroll with route change
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

    // Unified image style updater
    const updateImageStyle = (scrollTop, screenHeight, pathname) => {
        let screenIndex = 0;

        if (scrollTop === 0) {
            if (pathname.startsWith("/map")) screenIndex = 3;
            else if (pathname.startsWith("/landing2")) screenIndex = 1;
            else if (pathname.startsWith("/landing3")) screenIndex = 2;
        } else {
            screenIndex = Math.floor((scrollTop + screenHeight / 2) / screenHeight);
        }

        let top = "0px";
        if (screenIndex === 0) {
            top = `${window.innerHeight * 0.95 - imgHeightRef.current}px`;
        } else if (screenIndex === 1 || screenIndex === 2) {
            top = `${window.innerHeight * 0.13}px`;
        }

        let opacity = 1;
        const fadeStart = screenHeight * 2;
        const fadeEnd = screenHeight * 2.2;
        if (scrollTop > fadeStart) {
            opacity = scrollTop >= fadeEnd ? 0 : 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
        }
        if (pathname.startsWith("/map")) {
            opacity = 0;
        }

        setImgStyle({top, opacity});
    };

    // Scroll listener
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let rafId = null;
        const onScroll = () => {
            if (programmaticScrollRef.current || isFirstLoadRef.current) return;
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
                    setTimeout(() => (programmaticScrollRef.current = false), 600);
                }
            }, 120);

            const computeOpacityOverlap = (textEl, imageRect) => {
                if (!textEl || !imageRect) return 1;
                const textRect = textEl.getBoundingClientRect();
                const overlap = imageRect.bottom - textRect.top;

                if (overlap <= 0) return 1;         // text below image
                if (overlap >= textRect.height) return 0; // fully hidden
                return 1 - overlap / textRect.height;     // partial fade
            };


            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrollTop = el.scrollTop;
                const screenHeight = el.clientHeight;

                // Update the UNPP image position
                updateImageStyle(scrollTop, screenHeight, location.pathname);
                setScrollY(scrollTop);

                // Get image DOMRect
                const imageRect = imageRef.current?.getBoundingClientRect();

                // Helper to get text element of each screen
                const getTextElement = (screenIdx) =>
                    el.children[screenIdx]?.querySelector('[data-screen-text]');

                // Fade text based on overlap with image
                setScreen2Opacity(computeOpacityOverlap(getTextElement(1), imageRect));
                setScreen3Opacity(computeOpacityOverlap(getTextElement(2), imageRect));
            });

        };

        // Run once
        updateImageStyle(el.scrollTop, el.clientHeight, location.pathname);

        el.addEventListener("scroll", onScroll, {passive: true});
        return () => {
            el.removeEventListener("scroll", onScroll);
            if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [location.pathname, navigate, screens]);

    // First scroll disables firstLoadRef
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onFirstScroll = () => {
            if (isFirstLoadRef.current) isFirstLoadRef.current = false;
        };
        el.addEventListener("scroll", onFirstScroll, {once: true});
        return () => el.removeEventListener("scroll", onFirstScroll);
    }, []);

    // Handle image load
    const handleImageLoad = (e) => {
        imgHeightRef.current = e.target.offsetHeight;
        updateImageStyle(containerRef.current.scrollTop, containerRef.current.clientHeight, location.pathname);
        setImgReady(true); // enable transitions only after first position
    };

    const currentScreen = Math.floor((scrollY + window.innerHeight / 2) / window.innerHeight);
    const showBurger = currentScreen !== 0;

    return (
        <div className="relative h-screen w-screen">
            <LogoHeader scrollY={scrollY} scrollToHome={() => scrollToScreen(0)}/>

            {/* UNPP Animation Image */}
            <img
                id="fixed-unpp"
                src={process.env.PUBLIC_URL + "/img/unpp.gif"}
                alt="UNPP animation"
                className={`fixed h-auto left-1/2 -translate-x-1/2 z-10
                            ${imgReady ? "transition-all duration-300" : ""}`}
                style={{
                    ...imgStyle,
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    maxWidth: "360px",
                    pointerEvents: "none",
                }}
                onLoad={handleImageLoad}
                ref={imageRef}
            />

            {/* Burger menu */}
            {showBurger && (
                <button
                    className="fixed top-[16px] right-4 z-50 p-2 rounded-md focus:outline-none"
                    style={{backgroundColor: "rgba(0,0,0,0)"}}
                    onClick={() => setMenuOpen(true)}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            )}

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
            {aboutOpen && <AboutModal closeModal={() => setAboutOpen(false)}/>}
            {supportOpen && <SupportModal closeModal={() => setSupportOpen(false)}/>}

            {/* Scroll container */}
            <div
                ref={containerRef}
                className="scroll-container h-screen w-screen overflow-y-scroll scroll-snap-y snap-mandatory"
            >
                {screens.map((screen, idx) => (
                    <div
                        key={idx}
                        className="scroll-screen h-screen w-screen snap-start flex justify-center items-center"
                    >
                        {screen.name === "Screen2" ? (
                            <Screen2 opacity={screen2Opacity} />
                        ) : screen.name === "Screen3" ? (
                            <Screen3 opacity={screen3Opacity} />
                        ) : (
                            screen.component
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
