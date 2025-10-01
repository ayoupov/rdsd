export default function LogoHeader({ scrollY, scrollToHome }) {
    const maxShrink = 120;
    const factor = Math.min(scrollY / maxShrink, 1);

    // Explicit pixel sizes
    const initialWidth = 358;
    const initialHeight = 173;
    const finalWidth = 100;
    const finalHeight = 49;

    const width = initialWidth - (initialWidth - finalWidth) * factor;
    const height = initialHeight - (initialHeight - finalHeight) * factor;
    const top = 24 - 22 * factor;

    return (
        <div
            onClick={scrollToHome}
            className="fixed left-0 right-0 z-50 flex justify-center"
            style={{ top: `${top}px` }}
        >
            <img
                src={process.env.PUBLIC_URL + "/img/logo-white.svg"}
                alt="Logo"
                className="block"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    objectFit: "contain",
                    maxWidth: "none",
                }}
            />
        </div>

    );
}
