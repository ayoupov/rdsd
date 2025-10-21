import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyToLocation({ flyTo }) {
    const map = useMap();
    useEffect(() => {
        if (flyTo?.length === 2) map.flyTo(flyTo, 4);
    }, [flyTo, map]);
    return null;
}
