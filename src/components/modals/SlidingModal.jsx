// components/modals/SlidingModal.jsx
import React from "react";

export default function SlidingModal({ isOpen, closeModal, children }) {
    // Determine classes depending on desktop/mobile
    const containerClasses = "absolute absolute top-0 left-0 w-full h-full bg-white flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out";

    return (
        <div
            className={`${containerClasses} ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            {children}
        </div>
    );
}
