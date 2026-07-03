import api from "./api";

// Add Review
export const addReview = async (reviewData) => {
  const res = await api.post("/reviews", reviewData);
  return res.data;
};

// Get Reviews of a Product
export const getProductReviews = async (productId) => {
  const res = await api.get(`/reviews/${productId}`);
  return res.data;
};

















// Update Review
export const updateReview = async (reviewId, reviewData) => {
  const res = await api.put(`/reviews/${reviewId}`, reviewData);
  return res.data;
};

// Delete Review
export const deleteReview = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};