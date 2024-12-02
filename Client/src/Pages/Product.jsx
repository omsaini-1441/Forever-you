import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets, products } from "../assets/assets";
import RelatedProducts from "../Components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { Products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // Fetch product data based on the product ID
  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    // Fetch product data when productId or products change
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100 ">
      {/* Product data section */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row  ">
        {/* Product images section */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row ">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full ">
            {
              // Display product images with click functionality to change main image
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer "
                  alt=""
                />
              ))
            }
          </div>
          <div className="w-full sm:w-[80%]  ">
            {/* Main product image */}
            <img className="w-full h-auto " src={image} alt="" />
          </div>
        </div>

        {/* Product info section */}
        <div className="flex-1 ">
          <h1 className="font-medium text-2xl mt-2 ">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2  ">
            {/* Product rating stars */}
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-[0.35rem] ">(122)</p>
          </div>
          <p className="mt-5 font-medium text-3xl ">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 ">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8 ">
            <p>Select Size</p>
            <div className="flex gap-2  ">
              {
                // Display available sizes for the product
                productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 bg-gray-100 ${
                      item === size ? " border-orange-500 " : ""
                    } `}
                    key={index}
                  >
                    {item}
                  </button>
                ))
              }
            </div>
          </div>
          {/* Add to cart button */}
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700  "
          >
            ADD TO CART
          </button>
          <hr className="mt-8 w-4/5  " />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1  ">
            {/* Product policy section */}
            <p>• 100% Original product.</p>
            <p>• Cash on delivery is available on this product.</p>
            <p>• Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and review section */}
      <div className="mt-20 ">
        <div className="flex">
          <b className="border px-5 py-3 text-sm ">Description</b>
          <p className="border px-5 py-3 text-sm ">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 ">
          {/* Product description */}
          <p>
            {" "}
            We pride ourselves on offering an extensive range of high-quality
            products that cater to every lifestyle and occasion...
          </p>
          <p>
            Discover the perfect blend of style and quality with our curated
            collection of products...
          </p>
        </div>
      </div>

      {/* Related products section */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="text-gray-500 text-center p-4 border rounded-md bg-gray-50">
      Selected product not available yet.
    </div>
  );
};

export default Product;
