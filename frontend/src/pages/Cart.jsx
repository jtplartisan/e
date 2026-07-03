import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
} from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import { useState } from "react";

import {
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from "../services/cartService";

function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [info, setInfo] = useState("");

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleIncrease = async (item) => {
    if (item.stock && item.quantity >= item.stock) {
      setInfo("Maximum stock reached for this product");
      setTimeout(() => setInfo(""), 2000);
      return;
    }

    dispatch(increaseQty(item._id));

    try {
      await addToCartAPI({
        productId: item._id,
        quantity: 1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQty(id));
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCartAPI({ productId: id });
      dispatch(removeFromCart(id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleClearCart = async () => {
    const confirmClear = window.confirm("Clear your cart?");
    if (!confirmClear) return;

    try {
      await clearCartAPI();
      dispatch(clearCart());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-800">
            🛒 Shopping Cart
          </h1>
          <p className="text-sm text-gray-500">
            Review your items before checkout
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* INFO */}
        {info && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            {info}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow">
            <div className="text-5xl mb-3">🛍️</div>
            <h2 className="text-xl font-semibold text-gray-700">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-1">
              Start adding products you like
            </p>

            <Link
              to="/"
              className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">

              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >

                  {/* LEFT */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Price: <span className="font-medium">₹{item.price}</span>
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Stock: {item.stock ?? "N/A"}
                    </p>
                  </div>

                  {/* QTY */}
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <button
                      onClick={() => handleDecrease(item._id)}
                      className="w-8 h-8 bg-white rounded hover:bg-gray-200"
                    >
                      -
                    </button>

                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item)}
                      disabled={
                        item.stock
                          ? item.quantity >= item.stock
                          : false
                      }
                      className="w-8 h-8 bg-white rounded hover:bg-gray-200 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>

                </div>
              ))}

              {/* CLEAR CART */}
              <button
                onClick={handleClearCart}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-6">

              <h2 className="text-lg font-bold mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{items.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold text-gray-800">
                    ₹{total}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block mt-6 text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Secure checkout • Fast delivery
              </p>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;