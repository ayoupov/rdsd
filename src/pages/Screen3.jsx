export default function Screen3({opacity = 1}) {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 text-white relative">
            <div
                data-screen-text
                className="absolute w-full text-left md:text-base bottom-[0px] md:max-w-md text-[26px]/8 p-4 text-[#CDCDCD]"
                style={{opacity}}>
                This project explores 13 communities inhabiting the periphery of the modern built environment after
                their dream of living in the center of the modern technology failed.
            </div>
        </div>
    );
}
