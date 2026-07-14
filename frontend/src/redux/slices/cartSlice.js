import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
  },

  reducers: {

    // Backend se cart load karne ke liye
    setCart: (state, action) => {
      state.items = action.payload;
    },


    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (x) => x._id === item._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }
    },


    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },


    clearCart: (state) => {
      state.items = [];
    },


    increaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },


    decreaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

  },
});


export const {
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;


export default cartSlice.reducer;