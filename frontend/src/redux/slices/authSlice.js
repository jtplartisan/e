import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, getMe } from "../../services/authService";


export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async () => {
    const data = await getMe();
    return data.user;
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const data = await loginUser(formData);
    return data.user;
  }
);


export const register = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const data = await registerUser(formData);
    return data.user;
  }
);


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
      
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })

     
     .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;