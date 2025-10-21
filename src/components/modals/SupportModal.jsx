// components/SupportModal.jsx
import React from "react";
import CloseButton from "../CloseButton";
import BackArrowButtonLine from "../BackArrowButtonLine"

export default function SupportModal({closeModal, isDesktop = false}) {
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
