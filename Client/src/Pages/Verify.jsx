import React, { useContext, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, backendUrl, token, setCartItems } = useContext(ShopContext);
  const params = new URLSearchParams(window.location.search);
  const success = params.get("success");
  const sessionId = params.get("session_id");

  const verifyPayment = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      if (!success || !sessionId) {
        toast.error("Invalid payment session");
        navigate("/cart");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { session_id: sessionId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        toast.success("Payment successful");
        navigate("/orders");
      } else {
        toast.error(response.data.message);
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-600">Verifying payment...</p>
    </div>
  );
};

export default Verify;
