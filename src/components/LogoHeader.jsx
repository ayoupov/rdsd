export default function LogoHeader({ scrollY, scrollToHome }) {
    // Compute shrink factor based on scroll position
    // 0 = big logo, 1 = fully small
    const maxShrink = 120; // pixels after which logo is fully small
    const factor = Math.min(scrollY / maxShrink, 1);

    // interpolate size and top
    const width = 100 - 40 * factor; // big = 100%, small = 60%
    const top = 24 - 22 * factor;    // big = top-24, small = top-2
    const scale = 1 - 0.25 * factor; // optional scale effect

    return (
        <div
            className="fixed left-1/2 transform -translate-x-1/2 z-50 flex justify-center cursor-pointer transition-all duration-100"
            style={{
                top: `${top}px`,
                width: `${width}%`,
            }}
            onClick={scrollToHome}
        >
            <img
                src={process.env.PUBLIC_URL + "/img/logo-white.svg"}
                alt="Logo"
                style={{ transform: `scale(${scale})` }}
            />
        </div>
    );
}
