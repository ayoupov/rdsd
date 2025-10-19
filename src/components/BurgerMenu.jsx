import React from "react";

export default function BurgerMenu({show, onClick}) {
    if (!show) return null;

    return (
        <button
            className="fixed top-[22px] right-4 z-50 p-2 rounded-md focus:outline-none"
            style={{backgroundColor: "rgba(0,0,0,0)"}}
            onClick={onClick}
        >
            <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                />
            </svg>
        </button>
    );
}
