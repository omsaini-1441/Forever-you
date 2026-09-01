import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/add", label: "Add Product", desc: "Upload new items" },
  { to: "/list", label: "Products", desc: "Manage catalog" },
  { to: "/orders", label: "Orders", desc: "Track & update" },
];

const Sidebar = () => {
  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-73px)]">
      <nav className="p-4 lg:p-6 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
        {links.map(({ to, label, desc }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 border transition-all duration-200 min-w-[140px] lg:min-w-0 ${
                isActive
                  ? "bg-gray-900 border-gray-900 text-white shadow-md"
                  : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <p className="text-sm font-semibold">{label}</p>
                <p
                  className={`text-xs mt-0.5 ${
                    isActive ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {desc}
                </p>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
