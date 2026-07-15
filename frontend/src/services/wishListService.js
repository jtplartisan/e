import api from "./api";


export const addToWishlist = async (productId) => {
  const res = await api.post("/wishlist/add", {
    productId,
  });
  return res.data;
};



export const getWishlist = async () => {
  const res = await api.get("/wishlist");
  return res.data;
};



export const removeFromWishlist = async (productId) => {
  const res = await api.delete(`/wishlist/remove/${productId}`);
  return res.data;
};