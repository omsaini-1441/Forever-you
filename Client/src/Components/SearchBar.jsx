import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

// SearchBar component handles the search functionality and visibility
const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Effect to control visibility based on current route
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true); // Show search bar on 'collection' pages
    } else {
      setVisible(false); // Hide search bar on other pages
    }
  }, [location]);

  return (
    <div
      className={`transition-all duration-700 overflow-hidden ${
        showSearch && visible
          ? "max-h-[150px] opacity-100"
          : "max-h-0 opacity-0"
      } border-t border-b bg-gray-50 text-center`}
    >
      {/* Search input section */}
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update search term
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <img className="w-4" src={assets.search_icon} alt="search-icon" />
      </div>

      {/* Close search bar */}
      <img
        onClick={() => setShowSearch(false)} // Close search bar when clicked
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt="close-icon"
      />
    </div>
  );
};

export default SearchBar;
