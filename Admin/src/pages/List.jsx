import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
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

  const removeProduct = async (id) => {
    if (!window.confirm("Remove this product from the catalog?")) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="View and manage all items in your storefront catalog."
        count={list.length}
      />

      {loading ? (
        <p className="text-sm text-gray-500">Loading products…</p>
      ) : list.length === 0 ? (
        <div className="admin-card p-10 text-center text-gray-500 text-sm">
          No products yet. Add your first item from Add Product.
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="hidden md:grid grid-cols-[72px_2fr_1fr_80px_80px] gap-4 items-center px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span className="text-center">Remove</span>
          </div>

          <div className="divide-y divide-gray-100">
            {list.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[56px_1fr] md:grid-cols-[72px_2fr_1fr_80px_80px] gap-3 md:gap-4 items-center px-4 md:px-5 py-4 hover:bg-gray-50/80 transition-colors"
              >
                <img
                  className="w-14 h-14 object-cover rounded-md border border-gray-200 bg-gray-100"
                  src={item.image[0]}
                  alt=""
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 md:hidden">
                    {item.category} · {currency}{item.price}
                  </p>
                </div>
                <p className="hidden md:block text-sm text-gray-600">
                  {item.category}
                </p>
                <p className="hidden md:block text-sm font-medium text-gray-900">
                  {currency}{item.price}
                </p>
                <button
                  type="button"
                  onClick={() => removeProduct(item._id)}
                  className="hidden md:flex mx-auto w-8 h-8 items-center justify-center rounded-full border border-gray-300 text-gray-500
                    hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors text-sm"
                  aria-label="Remove product"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => removeProduct(item._id)}
                  className="md:hidden text-xs text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
