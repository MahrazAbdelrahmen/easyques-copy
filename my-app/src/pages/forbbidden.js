

import { useNavigate } from "react-router-dom";


function Forbidden() {
    const navigator = useNavigate();
    return (
        <main class="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
            <h1 class="text-10xl font-extrabold text-lightgrey tracking-widest">403</h1>
            <div class="bg-green px-2 text-5xl rounded rotate-12 absolute">
                UNAUTHORIZED
            </div>
            <button onClick={()=>{navigator('/')}} className="border-2 border-blue rounded-xl px-5 py-2 grid hover:bg-grey">

                <h1 className="font-bold text-xl text-[#f5f5f5] text-center ">RETURN!</h1>

            </button>
        </main>
    );
}

export default Forbidden;