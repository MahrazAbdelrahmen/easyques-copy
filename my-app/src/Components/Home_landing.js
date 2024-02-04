import React from "react";
import RandomizeText from './test.js';
import { Link } from 'react-router-dom';

function Home_landing(params) {
  return (
    <div className="grid md:flex items-center justify-center h-[100vh]  ">
      <div className="landing-home-left grid content-center gap-8  justify-items-center m-5 lg:w-[50vw] ">
        <div className="text-xl">
    
          <RandomizeText initialText="Knowledge Unleashed." delay={80} resetDelay={800} />
        </div>
        
        <p className="w-[80vw] lg:w-[40vw] ">
          Discover the latest in science with our efficient scientific article
          search engine. Access cutting-edge research across disciplines, making
          exploration easy for researchers and academics. Revolutionize your
          scientific journey with precision and speed
        </p>
        <button className="border-2 border-blue rounded-xl px-5 py-2 grid hover:bg-grey">
        <Link to="./Register" className="text-blue">
           Register now !
          </Link>
      </button>
      </div>

      <div className="landing-home-right hidden lg:grid  content-center  gap-8 justify-items-center w-[50vw]">
        <img className=" h-[10vw]  " src="./Assets/logo.png" alt="" />
        <img className="  w-[25vw]" src="./Assets/nom.png" alt="" />
      </div>
    </div>
  );
}
export default Home_landing;
