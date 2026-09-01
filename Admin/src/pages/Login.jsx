import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Welcome back");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="prata-regular text-3xl text-gray-900">FOREVER YOU</p>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mt-2">
            Admin Portal
          </p>
        </div>

        <div className="admin-card p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">
            Manage products, orders, and inventory.
          </p>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <label className="admin-label" htmlFor="email">Email</label>
              <input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="admin-input"
                type="email"
                placeholder="admin@forever.com"
                required
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="password">Password</label>
              <input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="admin-input"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full py-3 mt-2 bg-gray-900 text-white text-sm font-medium rounded-md
                hover:bg-black transition-colors disabled:opacity-60"
              type="submit"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
