import { createSlice } from "@reduxjs/toolkit";

//  Load from localStorage
const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}; 

//  Save to localStorage
const saveCartToStorage = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(),
  },

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (x) => x._id === item._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      //  update localStorage
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];

      saveCartToStorage([]);
    },


    increaseQty: (state, action) => {
  const item = state.items.find((i) => i._id === action.payload);
  if (item) {
    item.quantity += 1;
  }
},

decreaseQty: (state, action) => {
  const item = state.items.find((i) => i._id === action.payload);

  if (item && item.quantity > 1) {
    item.quantity -= 1;
  }
},
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

export default cartSlice.reducer;