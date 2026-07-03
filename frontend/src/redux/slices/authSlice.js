import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, getMe } from "../../services/authService";

// Get current user
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async () => {
    const data = await getMe();
    return data.user;
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const data = await loginUser(formData);
    return data.user;
  }
);

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const data = await registerUser(formData);
    return data.user;
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    await logoutUser();
    

  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch user
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // login
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // register
     

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;