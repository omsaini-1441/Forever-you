import React from "react";

const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <div>
          <p className="text-xl tracking-wide text-gray-900">
            <span className="prata-regular">FOREVER</span>
            <span className="font-light"> YOU</span>
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">
            Admin Console
          </p>
        </div>
        <button
          onClick={() => setToken("")}
          className="text-sm font-medium border border-gray-900 text-gray-900 px-5 py-2 rounded-full
            hover:bg-gray-900 hover:text-white transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
