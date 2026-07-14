import { useEffect, useState } from "react";
import api from "../../services/api";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FILTER
  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🛍️ Shop
        </h1>
        <p className="text-gray-500 mt-1">
          Explore the best products for you
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* EMPTY */}
      {filteredProducts?.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          📦 No products found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map((p) => (
            <div
              key={p._id}  
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden group border"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden aspect-4/3 bg-gray-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* NAME */}
                <h2 className="font-semibold text-gray-800 line-clamp-1">
                  {p.name}
                </h2>

                {/* PRICE */}
                <p className="text-blue-600 font-bold mt-1">
                  ₹{p.price}
                </p>

                {/* DATE */}
                {p.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    shop on:{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Shop;