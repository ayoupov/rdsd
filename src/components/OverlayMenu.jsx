// components/OverlayMenu.jsx
import React from "react";

export default function OverlayMenu({closeMenu, openAbout, openSupport}) {
    const links = ["About", "Support the project", "Instagram"];

    const handleInstagramClick = () => {
        const username = "lndwrks";
        const appUrl = `instagram://user?username=${username}`;
        const webUrl = `https://www.instagram.com/${username}`;

        // Try to open the app first
        const now = Date.now();
        window.location.href = appUrl;

        // If the app doesn't open (e.g., on desktop or no app installed),
        // after ~800ms open the web page instead
        setTimeout(() => {
            if (Date.now() - now < 1500) {
                window.open(webUrl, "_blank");
            }
        }, 800);

        closeMenu();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-white">

            <div className="flex flex-col items-center justify-center flex-grow space-y-6">
                {links.map((label, idx) => (
                    <button
                        key={idx}
                        className="text-3xl text-black hover:text-gray-600 transition"
                        onClick={() => {
                            if (label === "About") {
                                openAbout();
                            } else if (label === "Support the project") {
                                openSupport();
                            } else if (label === "Instagram") {
                                handleInstagramClick();
                            } else {
                                closeMenu();
                            }
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Full-width black logo at the bottom
            // const initialWidth = 358;
            // const initialHeight = 173;
            */}
            <div className="w-full p-4 flex justify-center">
                <img
                    src={process.env.PUBLIC_URL + "/img/logo-black.svg"}
                    alt="Logo"
                    className="w-full max-w-[358px] object-contain"
                />
            </div>

            {/* Close button */}
            <button
                className="absolute top-6 right-4 text-black p-2"
                onClick={() => closeMenu()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    className="w-5 h-5"
                >
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    );
}
