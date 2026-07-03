import api from "./api";

// Add to cart
export const addToCart = async (data) => {
  const res = await api.post("/cart/add", data);
  return res.data;
};

// Remove from cart
export const removeFromCart = async (data) => {
  const res = await api.post("/cart/remove", data);
  return res.data;
};

// Clear cart
export const clearCart = async () => {
  const res = await api.post("/cart/clear");
  return res.data;
};