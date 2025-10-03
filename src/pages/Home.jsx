export default function Home() {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 text-white relative">
            <div
                className="absolute left-0 right-0 px-4 text-center overflow-hidden top-[240px]"
                style={{
                    bottom: `calc(10% + 1rem)`, // 10% margin from bottom + small padding
                }}
            >
                <div className="md:text-base mx-auto max-w-xs md:max-w-md font-sans text-[#6A6A6A] text-[18pt] leading-tight">
                    A remote detour around<br/>
                    Unfinished Nuclear Power<br/>
                    Plants and their settlements
                </div>
            </div>
        </div>
    );
}
