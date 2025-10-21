// PlaceModal.jsx
import React from "react";
import BackArrowButtonLine from "../BackArrowButtonLine"


export default function PlaceModal({ selectedPlace, activeTab, setActiveTab, closeModal, isClosing, isDesktop = false }) {
    if (!selectedPlace) return null;
    const showImages = false;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto"
            onClick={closeModal}
        >
            <div
                className="bg-white w-full max-w-md min-h-screen rounded-none p-4 shadow-xl relative transition-transform transition-opacity duration-400 ease-out"
                style={{
                    transform: isClosing ? "translateX(-100%)" : "translateX(0)",
                    opacity: isClosing ? 0 : 1,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button row */}
                <BackArrowButtonLine onClick={closeModal}/>
                {/* Tabs Header */}
                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-1 text-center font-semibold border-b-2 ${
                            activeTab === "unpp" ? "border-black text-black" : "border-transparent text-[#6A6A6A]"
                        }`}
                        onClick={() => setActiveTab("unpp")}
                    >
                        {selectedPlace.name}
                    </button>
                    <button
                        className={`flex-1 py-1 text-center font-semibold border-b-2 ${
                            activeTab === "set" ? "border-black text-black" : "border-transparent text-[#6A6A6A]"
                        }`}
                        onClick={() => setActiveTab("set")}
                    >
                        {selectedPlace.set_name}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* UNPP Tab */}
                    {activeTab === "unpp" && (
                        <div className="transition-opacity duration-300 opacity-100">
                            {showImages && selectedPlace.img_name && (
                                <img
                                    src={process.env.PUBLIC_URL + "/img/IMG_UNPP/" + selectedPlace.img_name + ".png"}
                                    alt={selectedPlace.name}
                                    className="w-full h-auto object-contain rounded-lg mb-4"
                                />
                            )}

                            <table className="w-full text-left mb-4 text-[#6A6A6A] text-[18px]">
                                <tbody>
                                <tr className="border-t border-b border-[#CDCDCD]">
                                    <td>Construction: {selectedPlace.construction_years || "N/A"}</td>
                                </tr>
                                <tr className="border-t border-b border-[#CDCDCD]">
                                    <td>Planned: {selectedPlace.planned || "N/A"}</td>
                                </tr>
                                <tr className="border-t border-b border-[#CDCDCD]">
                                    <td>Status: {selectedPlace.status || "N/A"}</td>
                                </tr>
                                </tbody>
                            </table>

                            {selectedPlace.description?.split("\\n").map((line, idx) => (
                                <p className="mb-4 text-[18px]" key={idx}>{line}</p>
                            ))}
                        </div>
                    )}

                    {/* Set Tab */}
                    {activeTab === "set" && (
                        <div className="transition-opacity duration-300 opacity-100">
                            {showImages && selectedPlace.set_id && (
                                <img
                                    src={process.env.PUBLIC_URL + "/img/IMG_SETTLEMENT/" + selectedPlace.set_id + "_MAP.png"}
                                    alt={selectedPlace.name + " settlement"}
                                    className="w-full h-auto object-contain rounded-lg mb-4"
                                />
                            )}

                            <table className="w-full text-left mb-4 text-[#6A6A6A] text-[18px]">
                                <tbody>
                                <tr className="border-t border-b border-[#CDCDCD]">
                                    <td>Est.: {selectedPlace.set_est || "N/A"}</td>
                                </tr>
                                <tr className="border-t border-b border-[#CDCDCD]">
                                    <td>Planned population: {selectedPlace.set_planned_pop || "N/A"}</td>
                                </tr>
                                <tr className="border-t border-b border-[#CDCDCD]">
                                    <td>Current population: {selectedPlace.set_cur_pop || "N/A"}</td>
                                </tr>
                                </tbody>
                            </table>

                            {selectedPlace.set_description?.split("\\n").map((line, idx) => (
                                <p className="mb-4 text-[18px]" key={idx}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
