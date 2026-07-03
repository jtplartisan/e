import { useEffect, useState } from "react";
import {
  getMyProducts,
  deleteProduct,
} from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Package, Search } from "lucide-react";

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getMyProducts();
    setProducts(res?.products || res || []);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/seller/edit-product/${id}`);
  };

  // 🔍 SEARCH FILTER
  const filteredProducts = products.filter((p) => {
    return (
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Products
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all your listed products
            </p>
          </div>

          {/* TOTAL CARD */}
          <div className="bg-white shadow rounded-xl px-6 py-4 flex items-center gap-3">
            <Package className="text-blue-600" size={26} />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="text-2xl font-bold">
                {products.length}
              </h2>
            </div>
          </div>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-3">
          <Search className="text-gray-400" />

          <input
            type="text"
            placeholder="Search by name, category or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {product.name}
                          </h3>

                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center font-semibold text-green-600">
                      ₹{product.price}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-16 text-gray-500"
                  >
                    <Package size={50} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default SellerProducts;