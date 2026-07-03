import api from "./api";

// Create order (checkout)
export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

// Customer orders
export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

// Seller Orders
export const getSellerOrders = async () => {
  const res = await api.get("/seller/orders");
  return res.data;
};

//return

export const returnOrder = async (orderId, reason) => {
  const res = await api.put(`/orders/${orderId}/return`, {
    reason,
  });
  return res.data;
};





// Ship order (Seller)
export const shipOrder = async (orderId) => {
  const res = await api.put(`/seller/orders/${orderId}/ship`);
  return res.data;
};

// payment
export const payOrder = async (orderId) => {
  const res = await api.put(`/orders/${orderId}/pay`);
  return res.data;
};


export const deliverOrder = async (orderId) => {
  const res = await api.put(`/orders/${orderId}/deliver`);
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await api.put(`/orders/${orderId}/cancel`);
  return res.data;
};


export const rejectOrder = async (orderId) => {
  const res = await api.put(`/orders/${orderId}/reject`);
  return res.data;
};


export const rejectReturn = async (orderId) => {
  const res = await api.put(
    `/orders/${orderId}/return/reject`
  );
  return res.data;
};

export const acceptReturn = async (orderId) => {
  const res = await api.put(
    `/orders/${orderId}/return/accept`
  );
  return res.data;
};


export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};