import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  // Get the currency symbol from context
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      {/* Product image with hover effect */}
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out duration-500"
          src={image[0]} 
          alt=""
        />
      </div>
      {/* Product name and price */}
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
