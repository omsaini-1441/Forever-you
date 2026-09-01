import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";

const statusColors = {
  "Order Placed": "bg-blue-50 text-blue-700 border-blue-200",
  Packing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Out for delivery": "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
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

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Status updated");
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Update fulfillment status as orders move through your pipeline."
        count={orders.length}
      />

      {loading ? (
        <p className="text-sm text-gray-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="admin-card p-10 text-center text-gray-500 text-sm">
          No orders yet. They will appear here when customers checkout.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const thumb = order.items[0]?.image?.[0];
            const statusClass =
              statusColors[order.status] ||
              "bg-gray-50 text-gray-700 border-gray-200";

            return (
              <div
                key={order._id}
                className="admin-card p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-5"
              >
                <div className="flex gap-4">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                      Order
                    </div>
                  )}
                  <div className="text-sm text-gray-700 min-w-0">
                    <p className="font-semibold text-gray-900 mb-2">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                    {order.items.map((item, idx) => (
                      <p className="text-gray-600 truncate" key={idx}>
                        {item.name} × {item.quantity}{" "}
                        <span className="text-gray-400">({item.size})</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-5">
                  <p className="font-medium text-gray-900">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zipcode}
                  </p>
                  <p>{order.address.phone}</p>
                  <p className="text-xs text-gray-400 pt-1">
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                  <p className="text-lg font-semibold text-gray-900">
                    {currency}{order.amount}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full border ${
                        order.payment
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full border ${statusClass}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="admin-input text-sm font-medium max-w-[200px]"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
