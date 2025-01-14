import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 overflow-hidden">
      {/* Left section: Text content */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          {/* Bestseller indicator */}
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          {/* Main heading */}
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          {/* Call to action */}
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Right section: Hero image */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <img
          className="w-full sm:w-auto hover:scale-110 transition-transform duration-500 ease-in-out"
          src={assets.hero_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Hero;
