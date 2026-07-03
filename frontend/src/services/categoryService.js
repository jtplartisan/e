import api from "./api";

// Add Category
export const addCategory = async (data) => {
  const res = await api.post("/categories/add", data);
  return res.data;
};

// Get All Categories
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// Update Category
export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
}; 

// Delete Category
export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};