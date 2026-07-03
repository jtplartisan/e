import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // FILTER PRODUCTS
  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // RESET PAGE ON SEARCH
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // PAGINATION LOGIC
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentProducts = filteredProducts?.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    (filteredProducts?.length || 0) / itemsPerPage
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600 text-white py-16 px-6 text-center">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

        <h1 className="text-4xl md:text-5xl font-extrabold">
          Shop Smart, Save Big 🛍️
        </h1>

        <p className="mt-4 text-blue-100 text-lg">
          Discover premium products at unbeatable prices
        </p>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">

        {/* SEARCH */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TITLE */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🛒 Latest Products
          </h2>

          <span className="text-sm text-gray-500">
            {filteredProducts?.length || 0} items found
          </span>
        </div>

        {/* EMPTY STATE */}
        {filteredProducts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">
              Try different search keyword
            </p>
          </div>
        ) : (
          <>
            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {currentProducts?.map((p) => (
                <div
                  key={p._id}
                  className="hover:scale-[1.03] transition duration-300"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-10">

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-5 py-2 bg-white border rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="text-sm font-medium text-gray-700">
                Page{" "}
                <span className="text-blue-600 font-semibold">
                  {currentPage}
                </span>{" "}
                of <span>{totalPages || 1}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-5 py-2 bg-white border rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Home;