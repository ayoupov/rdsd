export default function Screen2() {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 text-white relative">
            <img
                src={process.env.PUBLIC_URL + "/img/unpp.gif"}
                className="w-full max-w-xs md:max-w-md mt-2"
                alt="UNPP animation"
            />
            <div className="w-full text-center text-sm md:text-base mt-44 mb-4 max-w-xs md:max-w-md">
                Founded in 2016, the project explores the phenomenon of cities built for the development of nuclear
                power plants. Once envisioned as centers of technological progress, now left on the margins.
            </div>
        </div>
    );
}
