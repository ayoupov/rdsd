import React from "react";

export default function StepScrollerItem({ item, opacity, height, onClick }) {
    return (
        <button
            className="w-full my-1 px-3 py-3 text-left rounded-lg flex justify-between items-center"
            style={{
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,1)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                textShadow: "0 2px 3px rgba(0,0,0,0.6)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity,
                height: height - 2,
                transition: "opacity 0.15s",
            }}
            onClick={() => onClick && onClick(item)}
        >
      <span className="overflow-hidden text-ellipsis">
        {item.name} / {item.set_name}
      </span>
            <span className="ml-2" style={{ opacity, display: "flex", alignItems: "center" }}>
        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L9 7 L0 14" stroke="white" strokeWidth="2"/>
        </svg>
      </span>
        </button>
    );
}
