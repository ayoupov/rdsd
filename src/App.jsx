import React, {useEffect, useState} from "react";
import MobileScrollLayout from "./layouts/MobileScrollLayout";
import DesktopLayout from "./layouts/DesktopLayout";

export default function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile ? <MobileScrollLayout/> : <DesktopLayout />;
}
