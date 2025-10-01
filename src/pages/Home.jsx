export default function Home() {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 text-white relative">

            {/*<div className="w-full text-center text-sm md:text-base mt-44 mb-4 max-w-xs md:max-w-md">*/}
            {/*    A remote detour around <br/>*/}
            {/*    Unfinished Nuclear Power Plants <br/>*/}
            {/*    and their settlements*/}
            {/*</div>*/}
            <div
                className="absolute left-0 right-0 px-4 text-center overflow-hidden top-[40%]"
                style={{
                    bottom: `calc(10% + 1rem)`, // 10% margin from bottom + small padding
                }}
            >
                <div className="text-sm md:text-base mx-auto max-w-xs md:max-w-md">
                    A remote detour around <br />
                    Unfinished Nuclear Power Plants <br />
                    and their settlements
                </div>
            </div>
            {/*<img*/}
            {/*    src={process.env.PUBLIC_URL + "/img/unpp.gif"}*/}
            {/*    className="w-full max-w-xs md:max-w-md mt-2"*/}
            {/*    alt="UNPP animation"*/}
            {/*/>*/}
        </div>
    );
}
