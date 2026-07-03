import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../redux/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { addToCart as addToCartAPI } from "../services/cartService";
import { getProductReviews } from "../services/reviewService";

/* STAR UI */
function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center text-yellow-400 text-sm">
      {[1, 2, 3, 4, 5].map((star) => {
        const diff = rating - star + 1;

        return (
          <span key={star} className="text-base">
            {diff >= 1 ? (
              <FaStar />
            ) : diff >= 0.5 ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar />
            )}
          </span>
        );
      })}
    </div>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item._id === product._id)
  );

  const currentQty = cartItem?.quantity || 0;

  // SELLER CHECK ADDED  
  const isSeller = user?.role === "seller"; 

  const isOutOfStock = product.stock === 0; 
  const isLimitReached =
    product.stock > 0 && currentQty >= product.stock; 

  let statusText = "Add";
  let isDisabled = false;

  if (isOutOfStock) {
    statusText = "Sold Out";
    isDisabled = true;
  } else if (isLimitReached) {
    statusText = "Limit Reached";
    isDisabled = true;
  } else if (isSeller) {
    statusText = "Sellers Not Allowed";
    isDisabled = true;
  }

  // FETCH REVIEWS
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getProductReviews(product._id);
        const reviews = res.reviews || [];

        setTotalReviews(reviews.length);

        if (reviews.length > 0) {
          const avg =
            reviews.reduce((acc, r) => acc + r.rating, 0) /
            reviews.length;

          setRating(Number(avg.toFixed(1))); 
        } else {
          setRating(0);
        }
      } catch (err){
        console.log(err); 
      }
    };

    fetchReviews();
  }, [product._id]);

  const handleAddToCart = async () => {
    if (isDisabled) return;

    if (!user) {
      alert("Please login first to add items to cart");
      navigate("/login");
      return;
    }

    //EXTRA SAFETY
    if (isSeller) {
      alert("Sellers cannot add items to cart");
      return;
    }

    try {
      await addToCartAPI({
        productId: product._id,
        quantity: 1,
      });

      dispatch(addToCart(product));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover group-hover:scale-110 transition duration-300"
        />

        <span
          className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full ${
            isOutOfStock
              ? "bg-red-600"
              : isLimitReached
              ? "bg-orange-500"
              : "bg-blue-600"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isLimitReached
            ? "Limited"
            : "New"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4">

        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Sold by: {product.seller?.name || "Admin"}
        </p>

        <p className="text-blue-600 font-bold text-lg mt-1">
          ₹{product.price}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-2 mt-1">
          <Stars rating={rating} />

          <span className="text-gray-800 text-sm font-semibold">
            {rating.toFixed(1)}
          </span>

          <span className="text-gray-500 text-xs">
            ({totalReviews})
          </span>
        </div>

        {/* STOCK WARNING */}
        {(isOutOfStock || isLimitReached) && (
          <p
            className={`text-xs mt-2 ${
              isOutOfStock ? "text-red-500" : "text-orange-500"
            }`}
          >
            {isOutOfStock
              ? "Sold out"
              : "Maximum stock limit reached"}
          </p>
        )}

        {/* SELLER WARNING */}
        {isSeller && (
          <p className="text-xs mt-2 text-red-500">
            Sellers are not allowed to purchase products
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-4">

          <Link
            to={`/product/${product._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            <FaShoppingCart />
            {statusText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;