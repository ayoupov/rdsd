import React from "react";

export default function CloseButton({ onClick, className = "", color = "black" }) {
    return (
        <div className={`flex justify-start mb-2 ${className}`} onClick={onClick}>
            <button
                onClick={onClick}
                className="text-gray-700 hover:text-black text-xl"
                aria-label="Close"
            >
                ←
            </button>
        </div>
    );
}
