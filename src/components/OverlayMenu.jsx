// components/OverlayMenu.jsx
import React from "react";
import CloseButton from "./CloseButton";

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
            <CloseButton onClick={() => closeMenu()} color="black" />

        </div>
    );
}
