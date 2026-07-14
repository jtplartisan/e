import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("description", data.description.trim());
      formData.append("category", data.category);
      formData.append("price", Number(data.price));
      formData.append("stock", Number(data.stock));

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      } else {
        alert("Image is required");
        return;
      }

      await createProduct(formData);

      alert("Product added successfully!");

      reset();
      
      navigate("/dashboard/seller/products");
    } catch (err) {
      console.log("Add product error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition";

  const labelClass = "block mb-1 text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Product Name */}
          <div>
            <label className={labelClass}>Product Name</label>

            <input
              {...register("name", {
                required: "Product name is required",
              })}
              placeholder="Enter product name"
              className={inputClass}
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.name?.message}
            </p>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price</label>

              <input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 1,
                    message: "Price must be greater than 0",
                  },
                })}
                placeholder="₹0.00"
                className={inputClass}
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.price?.message}
              </p>
            </div>

            <div>
              <label className={labelClass}>Stock</label>

              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: {
                    value: 1,
                    message: "Stock must be at least 1",
                  },
                })}
                placeholder="0"
                className={inputClass}
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.stock?.message}
              </p>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>

            <select
              {...register("category", {
                required: "Category is required",
              })}
              className={inputClass}
              defaultValue=""
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <p className="text-red-500 text-xs mt-1">
              {errors.category?.message}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>

            <textarea
              rows={4}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters required",
                },
              })}
              placeholder="Write product description..."
              className={inputClass}
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.description?.message}
            </p>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>Product Image</label>

            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: "Image is required",
              })}
              className="w-full text-sm text-gray-600
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-lg
                file:border-0
                file:text-sm
                file:font-semibold
                file:bg-blue-50
                file:text-blue-700
                hover:file:bg-blue-100"
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.image?.message}
            </p>
          </div>

      
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;