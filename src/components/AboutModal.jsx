// components/AboutModal.jsx
import React from "react";

export default function AboutModal({closeModal}) {
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
                About the project
            </h1>

            {/* Scrollable text */}
            <div className="flex-1 overflow-y-auto p-6 text-[18px]">
                <p>
                    Roadside Picnic is an independent research project by Paul Cetnarski (LANDWORKS), investigating the
                    unfinished legacy of nuclear energy infrastructure. Through years of fieldwork at Unfinished Nuclear
                    Power Plants and their satellite settlements, the project traces communities suspended within an
                    incomplete origin myth. Its title echoes the Strugatsky brothers’ 1972 novel, whose surreal “zones”
                    shed light on the condition of life at the margins of the modern built environment. Developed
                    through exhibitions and publications, Roadside Picnic is evolving into a comprehensive atlas of
                    these sites.
                </p>
                <br/>
                <p className="text-[#6A6A6A] text-[18px]">
                    © All rights reserved 2025 LANDWORKS<br/>
                    Research: Paul Cetnarski<br/>
                    Web Design: Alexandra Fedorovskaya<br/>
                    Web Development: Alexander Ayoupov
                </p>
            </div>
        </div>
    );
}
