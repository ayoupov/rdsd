// src/layouts/MobileScrollLayout.jsx
import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Home from "../pages/Home";
import Screen2 from "../pages/Screen2";
import Screen3 from "../pages/Screen3";
import MapScreen from "../pages/MapScreen";
import BurgerMenu from "../components/BurgerMenu";
import LogoHeader from "../components/LogoHeader";
import OverlayMenu from "../components/OverlayMenu";
import AboutModal from "../components/AboutModal";
import SupportModal from "../components/SupportModal";

export default function MobileScrollLayout() {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [screen2Opacity, setScreen2Opacity] = useState(1);
    const [screen3Opacity, setScreen3Opacity] = useState(1);

    const programmaticScrollRef = useRef(false);
    const scrollDebounceRef = useRef(null);
    const lastMapPathRef = useRef("/map");
    const isFirstLoadRef = useRef(true);
    const imageRef = useRef(null);

    const imgHeightRef = useRef(0);
    const [imgStyle, setImgStyle] = useState({ top: "0px", opacity: 1 });

    const screens = useMemo(
        () => [
            { name: "Home", path: "/", component: <Home /> },
            { name: "Screen2", path: "/landing2", component: <Screen2 /> },
            { name: "Screen3", path: "/landing3", component: <Screen3 /> },
            { name: "MapScreen", path: "/map", component: <MapScreen /> },
        ],
        []
    );

    useEffect(() => {
        const setVh = () => {
            const vh = window.visualViewport
                ? window.visualViewport.height * 0.01
                : window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };
        setVh();
        window.visualViewport?.addEventListener("resize", setVh);
        window.addEventListener("resize", setVh);
        return () => {
            window.visualViewport?.removeEventListener("resize", setVh);
            window.removeEventListener("resize", setVh);
        };
    }, []);

    useEffect(() => {
        if (location.pathname.startsWith("/map")) {
            lastMapPathRef.current = location.pathname;
        }
    }, [location.pathname]);

    const scrollToScreen = (index) => {
        if (!containerRef.current) return;
        const top = containerRef.current.children[index].offsetTop;
        programmaticScrollRef.current = true;
        containerRef.current.scrollTo({ top, behavior: "smooth" });
        const targetPath =
            screens[index].path === "/map"
                ? lastMapPathRef.current
                : screens[index].path;
        navigate(targetPath, { replace: true });
        setTimeout(() => (programmaticScrollRef.current = false), 500);
        setMenuOpen(false);
    };

    useEffect(() => {
        let normalized = location.pathname;
        if (location.pathname.startsWith("/map")) normalized = "/map";
        const idx = screens.findIndex((s) => s.path === normalized);
        if (idx === -1 || !containerRef.current) return;
        if (programmaticScrollRef.current) return;

        programmaticScrollRef.current = true;
        const top = containerRef.current.children[idx].offsetTop;
        containerRef.current.scrollTo({
            top,
            behavior: isFirstLoadRef.current ? "auto" : "smooth",
        });
        isFirstLoadRef.current = false;
        setTimeout(() => (programmaticScrollRef.current = false), 500);
    }, [location.pathname, screens]);

    const updateImageStyle = (scrollTop, screenHeight, pathname) => {
        const homeTop = window.innerHeight * 0.95 - imgHeightRef.current;
        const landingTop = window.innerHeight * 0.13;
        const transitionRange = 200;
        let top = homeTop;
        let progress = Math.min(scrollTop / transitionRange, 1);
        top = homeTop + (landingTop - homeTop) * progress;

        let opacity = 1;
        const fadeStart = screenHeight * 2;
        const fadeEnd = screenHeight * 2.2;
        if (scrollTop > fadeStart) {
            opacity =
                scrollTop >= fadeEnd
                    ? 0
                    : 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
        }
        if (pathname.startsWith("/map")) opacity = 0;

        setImgStyle({ top: `${top}px`, opacity });
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        let rafId = null;

        const computeOpacityOverlap = (textEl, imageRect) => {
            if (!textEl || !imageRect) return 1;
            const textRect = textEl.getBoundingClientRect();
            const overlap = imageRect.bottom - textRect.top;
            if (overlap <= 0) return 1;
            if (overlap >= textRect.height) return 0;
            return 1 - overlap / textRect.height;
        };

        const onScroll = () => {
            const scrollTop = el.scrollTop;
            const screenHeight = el.clientHeight;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                updateImageStyle(scrollTop, screenHeight, location.pathname);
                setScrollY(scrollTop);
                const imageRect = imageRef.current?.getBoundingClientRect();
                const getTextElement = (idx) =>
                    el.children[idx]?.querySelector("[data-screen-text]");
                setScreen2Opacity(computeOpacityOverlap(getTextElement(1), imageRect));
                setScreen3Opacity(computeOpacityOverlap(getTextElement(2), imageRect));
            });
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
                    navigate(targetPath, { replace: true });
                    setTimeout(() => (programmaticScrollRef.current = false), 600);
                }
            }, 120);
        };

        updateImageStyle(el.scrollTop, el.clientHeight, location.pathname);
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            el.removeEventListener("scroll", onScroll);
            if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [location.pathname, navigate, screens]);

    const handleImageLoad = (e) => {
        imgHeightRef.current = e.target.offsetHeight;
        updateImageStyle(
            containerRef.current.scrollTop,
            containerRef.current.clientHeight,
            location.pathname
        );
    };

    const currentScreen = Math.floor(
        (scrollY + window.innerHeight / 2) / window.innerHeight
    );
    const showBurger = currentScreen !== 0;

    return (
        <div className="relative h-screen w-screen">
            <LogoHeader scrollY={scrollY} scrollToHome={() => scrollToScreen(0)} />

            <img
                id="fixed-unpp"
                src={process.env.PUBLIC_URL + "/img/unpp.gif"}
                alt="UNPP animation"
                className="fixed h-auto left-1/2 -translate-x-1/2 z-10"
                style={{
                    ...imgStyle,
                    transition: programmaticScrollRef.current
                        ? "top 0.2s, opacity 0.2s"
                        : "none",
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    maxWidth: "360px",
                    pointerEvents: "none",
                }}
                onLoad={handleImageLoad}
                ref={imageRef}
            />

            <BurgerMenu show={showBurger} onClick={() => setMenuOpen(true)} />

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
