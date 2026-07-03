import api from "./api";

// Register
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// Logout
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

// Get current user
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};