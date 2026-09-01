import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const ImageBox = ({ image, setImage, id, label }) => (
    <label htmlFor={id} className="cursor-pointer group">
      <div
        className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center
          bg-gray-50 overflow-hidden group-hover:border-gray-900 group-hover:bg-white transition-colors"
      >
        {image ? (
          <img
            className="w-full h-full object-cover"
            src={URL.createObjectURL(image)}
            alt=""
          />
        ) : (
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            {label}
          </span>
        )}
      </div>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        accept="image/*"
        id={id}
        hidden
      />
    </label>
  );

  return (
    <div>
      <PageHeader
        title="Add Product"
        subtitle="Upload images and details — they appear on the storefront instantly."
      />

      <form
        onSubmit={onSubmitHandler}
        className="admin-card p-6 sm:p-8 space-y-6 max-w-2xl"
      >
        <div>
          <label className="admin-label">Product images</label>
          <div className="flex flex-wrap gap-3">
            <ImageBox image={image1} setImage={setImage1} id="image1" label="Main" />
            <ImageBox image={image2} setImage={setImage2} id="image2" label="Alt 2" />
            <ImageBox image={image3} setImage={setImage3} id="image3" label="Alt 3" />
            <ImageBox image={image4} setImage={setImage4} id="image4" label="Alt 4" />
          </div>
        </div>

        <div>
          <label className="admin-label" htmlFor="name">Product name</label>
          <input
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="admin-input"
            type="text"
            placeholder="e.g. Cotton Round Neck Top"
            required
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="admin-input min-h-[100px] resize-y"
            placeholder="Material, fit, care instructions…"
            required
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="admin-label" htmlFor="category">Category</label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="admin-input"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <label className="admin-label" htmlFor="subCategory">Sub category</label>
            <select
              id="subCategory"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="admin-input"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <label className="admin-label" htmlFor="price">Price</label>
            <input
              id="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="admin-input"
              type="number"
              min="1"
              placeholder="99"
              required
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                  sizes.includes(size)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            className="w-4 h-4 accent-gray-900"
          />
          <span className="text-sm text-gray-700">Feature as bestseller on home</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-md
            hover:bg-black transition-colors disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
