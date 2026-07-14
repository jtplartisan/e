import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../services/productService";


// FETCH PRODUCTS
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params = {}) => {
    const data = await getProducts(params);
    return data;
  }
);


const productSlice = createSlice({
  name: "product",

  initialState: {
    products: [],
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 8,
    loading: false,
    error: null,
  },


  reducers: {},


  extraReducers: (builder) => {

    // Loading
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });


    // Success
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;

      state.products = action.payload.products || [];

      state.totalProducts = action.payload.totalProducts || 0;

      state.totalPages = action.payload.totalPages || 1;

      state.currentPage = action.payload.page || 1;

      state.limit = action.payload.limit || 8;
    });


    // Error
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
});


export default productSlice.reducer;