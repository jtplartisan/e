import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        reset({
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          description: data.description,
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("price", Number(data.price));
      formData.append("stock", Number(data.stock));
      formData.append("category", data.category);
      formData.append("description", data.description);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await updateProduct(id, formData);

      alert("Product updated successfully");
      navigate("/dashboard/seller/products");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3 transition";

  const labelClass = "block mb-1 text-sm font-medium text-gray-700";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* NAME */}
          <div>
            <label className={labelClass}>Product Name</label>
            <input
              {...register("name")}
              placeholder="Enter product name"
              className={inputClass}
            />
          </div>                                     

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>Price</label>
              <input
                type="number"
                {...register("price")}
                placeholder="₹0.00"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                {...register("stock")}
                placeholder="0"
                className={inputClass}
              />
            </div>

          </div>

          {/* CATEGORY */}
          <div>
            <label className={labelClass}>Category</label>
            <input
              {...register("category")}
              placeholder="Category"
              className={inputClass}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder="Product description..."
              className={inputClass}
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className={labelClass}>Update Image (optional)</label>
            <input
              type="file"
              {...register("image")}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold
                         file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Update Product
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;