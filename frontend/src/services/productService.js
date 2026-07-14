import api from "./api";

// Get all products (with filters)
export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};


// Get single product
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// Create product (seller only)
export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Update product
export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// Get seller's own products
export const getMyProducts = async () => {
  const res = await api.get("/products/my-products");
  return res.data;
};

// Bulk upload products
export const createBulkProducts = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/products/bulk-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};