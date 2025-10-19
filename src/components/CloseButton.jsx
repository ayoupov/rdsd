import React from "react";

export default function CloseButton({ onClick, className = "", color = "black" }) {
    return (
        <button
            className={`absolute top-6 right-4 p-2 ${className}`}
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                stroke={color}
                fill="none"
                strokeWidth={2}
                className="w-[18px] h-[18px]"
            >
                <line x1="0" y1="0" x2="18" y2="18" strokeLinecap="round" />
                <line x1="18" y1="0" x2="0" y2="18" strokeLinecap="round" />
            </svg>
        </button>
    );
}
