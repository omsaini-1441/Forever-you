import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const [visible, setVisible] = useState(false); // State for controlling sidebar visibility
  const { showSearch, setShowSearch, getCartCount } = useContext(ShopContext); // Accessing context for search and cart
  const location = useLocation(); // To determine the active route

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo and home link */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      {/* Desktop navigation links */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {[
          { path: "/", label: "HOME" },
          { path: "/collection", label: "COLLECTION" },
          { path: "/about", label: "ABOUT" },
          { path: "/contact", label: "CONTACT" },
        ].map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className="flex flex-col items-center gap-1 relative"
          >
            <p>{label}</p>
            {/* Active route indicator */}
            {location.pathname === path && (
              <motion.hr
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                exit={{ width: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="w-2/4 border-none h-[1.5px] bg-gray-700 absolute bottom-[-3px]"
              />
            )}
          </NavLink>
        ))}
      </ul>

      {/* Search, Profile, Cart, and Menu Icons */}
      <div className="flex items-center gap-6">
        {/* Toggle search visibility */}
        <img
          onClick={() => setShowSearch(!showSearch)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />

        {/* Profile dropdown */}
        <div className="group relative">
          <Link to="/login">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt=""
            />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>

        {/* Cart Icon with item count */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile menu icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar menu for smaller screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ease-out duration-[400ms] ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          {/* Back button to close sidebar */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>

          {/* Mobile navigation links */}
          {[
            { path: "/", label: "HOME" },
            { path: "/collection", label: "COLLECTION" },
            { path: "/about", label: "ABOUT" },
            { path: "/contact", label: "CONTACT" },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              onClick={() => setVisible(false)} // Close menu on link click
              className="py-2 pl-6 border"
              to={path}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
