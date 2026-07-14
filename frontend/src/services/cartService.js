import api from "./api";


export const addToCart = async (data) => {
  const res = await api.post("/cart/add", data);
  return res.data;
};


export const removeFromCart = async (data) => {
  const res = await api.post("/cart/remove", data);
  return res.data;
};


export const clearCart = async () => {
  const res = await api.post("/cart/clear");
  return res.data;
};




export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};