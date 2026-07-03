import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder, getMyOrders } from "../../services/orderService";

// Create order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData) => {
    const data = await createOrder(orderData);
    return data;
  }
);

// Get user orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async () => {
    const data = await getMyOrders();
    return data;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export default orderSlice.reducer;