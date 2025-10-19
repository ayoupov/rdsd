// components/SupportModal.jsx
import React from "react";

export default function SupportModal({closeModal}) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">

            {/* Close button */}
            <button
                className="absolute top-6 right-4 text-black p-2"
                onClick={closeModal}
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

            {/* Center-top small logo
                // const finalWidth = 100;
                // const finalHeight = 49;
            */}
            <div className="flex justify-center mt-4">
                <img
                    src={process.env.PUBLIC_URL + "/img/logo-black.svg"}
                    alt="Logo"
                    className="max-w-[100px] full-w object-contain"
                />
            </div>

            {/* Header */}
            <h1 className="text-[32px] font-bold mt-6 px-6">
                Support the project
            </h1>

            {/* Scrollable text */}
            <div className="flex-1 overflow-y-auto p-6 text-[18px]">
                <p>
                    The project is ready to be shared through publications, lectures, and exhibitions. For
                    collaborations or support, please contact <a href="mailto:info@lndwrks.com">info@lndwrks.com</a>.
                </p>
            </div>
        </div>
    );
}
