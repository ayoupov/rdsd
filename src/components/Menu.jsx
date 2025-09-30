import React from "react";
import { Link } from "react-router-dom";

export default function Menu({ open, setOpen }) {
  return (
    <div className={`md:flex md:flex-col md:w-48 bg-gray-100 ${open ? "flex flex-col absolute inset-0 z-50 p-8" : "hidden"}`}>
      <Link to="/" onClick={() => setOpen(false)} className="p-2 hover:bg-gray-200">Home</Link>
      <Link to="/screen2" onClick={() => setOpen(false)} className="p-2 hover:bg-gray-200">Screen2</Link>
      <Link to="/screen3" onClick={() => setOpen(false)} className="p-2 hover:bg-gray-200">Screen3</Link>
      <Link to="/map" onClick={() => setOpen(false)} className="p-2 hover:bg-gray-200">Map</Link>
    </div>
  );
}
