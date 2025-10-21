// components/modals/AboutModal.jsx
import React from "react";
import CloseButton from "../CloseButton";
import BackArrowButtonLine from "../BackArrowButtonLine"

export default function AboutModal({ closeModal, isDesktop = false }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">

            {/* Close button */}
            {!isDesktop ? <CloseButton
                onClick={closeModal}
                color="black"
                className="absolute top-4 right-4"
            /> : <BackArrowButtonLine onClick={closeModal} className="px-6 pt-[16px]"/>
            }

            {/* Center-top small logo */}
            {!isDesktop && <div className="flex justify-center mt-4">
                <img
                    src={process.env.PUBLIC_URL + "/img/logo-black.svg"}
                    alt="Logo"
                    className="max-w-[100px] object-contain"
                />
            </div>}

            {/* Header */}
            <h1 className={`text-[32px] font-bold ${isDesktop ? "" : "mt-6"} px-6`}>
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
                <br />
                <p className="text-[#6A6A6A] text-[18px]">
                    © All rights reserved 2025 LANDWORKS<br />
                    Research: Paul Cetnarski<br />
                    Web Design: Alexandra Fedorovskaya<br />
                    Web Development: Alexander Ayoupov
                </p>
            </div>
        </div>
    );
}
