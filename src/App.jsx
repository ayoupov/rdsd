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
import BurgerMenu from "./components/BurgerMenu.jsx";

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
        const homeTop = window.innerHeight * 0.95 - imgHeightRef.current;
        const landingTop = window.innerHeight * 0.13;
        const transitionRange = 200;

        let startTop = homeTop;
        let endTop = landingTop;
        let progress = 0;

        // Determine which screen we are closer to
        if (scrollTop < screenHeight) {
            startTop = homeTop;
            endTop = landingTop;
            progress = Math.min(scrollTop / transitionRange, 1);
        } else if (scrollTop >= screenHeight && scrollTop < screenHeight * 2) {
            // Screen2 → Screen3 (if needed, adjust accordingly)
            startTop = landingTop;
            endTop = landingTop; // same for now, no change
            progress = 0;
        } else {
            startTop = landingTop;
            endTop = landingTop;
            progress = 0;
        }

        const top = startTop + (endTop - startTop) * progress;

        // Keep your existing opacity logic
        let opacity = 1;
        const fadeStart = screenHeight * 2;
        const fadeEnd = screenHeight * 2.2;
        if (scrollTop > fadeStart) {
            opacity = scrollTop >= fadeEnd ? 0 : 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
        }
        if (pathname.startsWith("/map")) opacity = 0;

        setImgStyle({ top: `${top}px`, opacity });
    };

    // Scroll listener
// Scroll listener with smooth image and debounced route
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let rafId = null;

        const computeOpacityOverlap = (textEl, imageRect) => {
            if (!textEl || !imageRect) return 1;
            const textRect = textEl.getBoundingClientRect();
            const overlap = imageRect.bottom - textRect.top;

            if (overlap <= 0) return 1;             // text below image
            if (overlap >= textRect.height) return 0; // fully hidden
            return 1 - overlap / textRect.height;     // partial fade
        };

        const onScroll = () => {
            const scrollTop = el.scrollTop;
            const screenHeight = el.clientHeight;

            // 1️⃣ Immediate image update
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                updateImageStyle(scrollTop, screenHeight, location.pathname);
                setScrollY(scrollTop);

                // Fade text immediately
                const imageRect = imageRef.current?.getBoundingClientRect();
                const getTextElement = (idx) => el.children[idx]?.querySelector('[data-screen-text]');
                setScreen2Opacity(computeOpacityOverlap(getTextElement(1), imageRect));
                setScreen3Opacity(computeOpacityOverlap(getTextElement(2), imageRect));
            });

            // 2️⃣ Debounced route sync
            if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
            scrollDebounceRef.current = setTimeout(() => {
                const children = Array.from(el.children);
                let closestIdx = 0;
                let closestDist = Infinity;

                children.forEach((child, idx) => {
                    const dist = Math.abs(child.offsetTop - scrollTop);
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
        };

        // Run once to set initial image position
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
                className="fixed h-auto left-1/2 -translate-x-1/2 z-10"
                style={{
                    ...imgStyle,
                    transition: programmaticScrollRef.current ? "top 0.2s, opacity 0.2s" : "none",
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
            <BurgerMenu show={showBurger} onClick={() => setMenuOpen(true)}/>

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
