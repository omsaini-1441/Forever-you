import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";

export const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const currency = "$";

const toastProps = {
  position: "top-center",
  autoClose: 2800,
  hideProgressBar: true,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  closeOnClick: true,
  draggable: false,
  newestOnTop: true,
  limit: 3,
  theme: "light",
  toastClassName: "forever-toast",
  bodyClassName: "forever-toast-body",
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) localStorage.setItem("adminToken", token);
    else localStorage.removeItem("adminToken");
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <ToastContainer {...toastProps} />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="*" element={<List token={token} />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
