export default function Screen2({opacity = 1}) {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 text-white relative">
            <div
                data-screen-text
                className="absolute w-full text-left md:text-base bottom-[0px] md:max-w-md text-[26px]/8 p-4 text-[#CDCDCD]"
                style={{opacity}}>
                There are 27 Unfinished Nuclear Power Plants worldwide, some requiring dedicated settlements for workers
                with families — nearly half a million people bound to projects that never reached completion.
            </div>
        </div>
    );
}
