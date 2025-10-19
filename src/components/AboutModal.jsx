// components/AboutModal.jsx
import React from "react";
import CloseButton from "./CloseButton";

export default function AboutModal({closeModal}) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">

            {/* Close button */}
            <CloseButton onClick={closeModal} color="black" />

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
