import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { getCategories } from "../services/categoryService";
import ProductCard from "../components/ProductCard";

function Home() {
  const dispatch = useDispatch();

  const {
    products = [],
    totalPages = 1,
    totalProducts = 0,
  } = useSelector((state) => state.product);


  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;


  // FETCH PRODUCTS WITH BACKEND PAGINATION

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: category || undefined,
        minRating: rating || undefined,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, category, rating, currentPage]);


  // FETCH CATEGORIES

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();

        const safeData = Array.isArray(data)
          ? data
          : data?.categories || [];

        setCategories(safeData);

      } catch (error) {
        console.log("Category fetch error:", error);
        setCategories([]);
      }
    };

    fetchCats();

  }, []);



  // SEARCH FILTER (CURRENT PAGE DATA)


  const currentProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );



  // RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, rating]);



  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100">


      {/* HERO */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600 text-white py-16 text-center">

        <h1 className="text-5xl font-bold">
          Shop Smart, Save Big 🛍️
        </h1>

        <p className="mt-4 text-lg">
          Discover premium products at unbeatable prices
        </p>

      </div>



      <div className="max-w-7xl mx-auto p-6">


        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">


          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />



          {/* CATEGORY */}
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >

            <option value="">
              All Categories
            </option>


            {categories.map((cat, idx) => (
              <option
                key={cat._id || idx}
                value={cat.name || cat}
              >
                {cat.name || cat}
              </option>
            ))}

          </select>




          {/* RATING */}
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >

            <option value="">
              All Ratings
            </option>

            <option value="4">
              4★ & Above
            </option>

            <option value="3">
              3★ & Above
            </option>

            <option value="2">
              2★ & Above
            </option>

            <option value="1">
              1★ & Above
            </option>

          </select>


        </div>




        {/* TITLE */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            🛒 Products
          </h2>


          <span>
            {totalProducts} Items Found
          </span>

        </div>





        {/* PRODUCTS */}

        {currentProducts.length === 0 ? (

          <div className="text-center py-20 text-gray-500 text-xl">
            📦 No Products Found
          </div>


        ) : (

          <>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {currentProducts.map((product) => (

                <ProductCard
                  key={product._id}
                  product={product}
                />

              ))}

            </div>





            {/* PAGINATION */}

            <div className="flex justify-center items-center gap-4 mt-10">


              <button

                disabled={currentPage === 1}

                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }

                className="px-4 py-2 border rounded disabled:opacity-50"

              >
                Previous

              </button>




              <span>
                {currentPage} / {totalPages}
              </span>





              <button

                disabled={currentPage === totalPages}

                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }

                className="px-4 py-2 border rounded disabled:opacity-50"

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