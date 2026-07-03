import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getMyOrders } from "../services/orderService";
import { addReview, getProductReviews } from "../services/reviewService";

/* STAR RATING */
function StarRating({ rating, setRating }) {
  return (
    <div className="flex gap-1 text-2xl cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => setRating(star)}>
          {rating >= star ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const [reviews, setReviews] = useState([]);

  /* FETCH REVIEWS */
  const fetchReviews = async () => {
    try {
      const res = await getProductReviews(id);
      setReviews(res?.reviews || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Product
        const productRes = await getProductById(id);
        setProduct(productRes);

        // Orders
        const orderRes = await getMyOrders();

        const orders = orderRes?.orders || [];
        const reviewedIds = orderRes?.reviewedProductIds || [];

        const purchased = orders.some(
          (order) =>
            order.orderStatus === "delivered" &&
            order.items?.some((item) => item.product?._id === id)
        );

        setCanReview(purchased);
        setAlreadyReviewed(reviewedIds.includes(id));

        // Load reviews automatically
        await fetchReviews();
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  /* SUBMIT REVIEW */
  const handleReviewSubmit = async () => {
    try {
      await addReview({
        product: id,
        rating,
        comment,
      });

      alert("Review submitted successfully!");

      setAlreadyReviewed(true);
      setShowReviewModal(false);
      setRating(1);
      setComment("");

      // Refresh reviews
      fetchReviews();
    } catch (err) {
      console.log(err);
      alert("Failed to submit review");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* PRODUCT CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-8">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          <h2 className="text-2xl font-bold text-green-600 mb-6">
            ₹{product.price}
          </h2>

          <div className="flex flex-wrap gap-3">

            {/* GIVE REVIEW */}
            {canReview && !alreadyReviewed && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                ⭐ Give Review
              </button>
            )}

            {/* ALREADY REVIEWED */}
            {alreadyReviewed && (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded font-medium">
                ✔ Reviewed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="max-w-5xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          Customer Rating & Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="border-b pb-3">
                <div className="text-yellow-500">
                  {"⭐".repeat(rev.rating)}
                  {"☆".repeat(5 - rev.rating)}
                </div>

                <p className="text-gray-700">{rev.comment}</p>

                <p className="text-sm text-gray-400">
                  {rev.user?.name || "Anonymous"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              Write Review
            </h2>

            <StarRating rating={rating} setRating={setRating} />

            <p className="text-sm text-gray-500 mt-1 mb-3">
              {rating}/5
            </p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-lg p-3 h-28"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleReviewSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;