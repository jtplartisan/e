import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductReviews } from "../services/reviewService";

function ReviewsPage() {
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const data = await getProductReviews(id);

        console.log("API Response:", data);

        //  SAFE FIX (important)
        setReviews(data?.reviews || data?.data || data || []);

      } catch (err) {
        console.log("Error fetching reviews:", err);
        setReviews([]); // fallback safety
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  if (loading) {
    return <p className="p-4">Loading reviews...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 mt-6 rounded shadow">

      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

      {/*  SAFE CHECK */}
      {!Array.isArray(reviews) || reviews.length === 0 ? (
        <p>No reviews found</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="border-b py-3">
            <p className="font-semibold">{r.user.name}</p>
            <p className="text-gray-700">{r.comment}</p>
            <p className="text-yellow-600">⭐ {r.rating}/5</p>
          </div>
        ))
      )}

    </div>
  );
}

export default ReviewsPage;