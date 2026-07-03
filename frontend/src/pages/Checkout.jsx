import { useState } from "react";
import { useSelector } from "react-redux";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  //  VALIDATION
  const validate = () => {
    let err = {};

    if (!address.trim()) {
      err.address = "Address is required";
    }

    if (!phone) {
      err.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      err.phone = "Phone must be 10 digits";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleOrder = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }  

    if (!validate()) return;

    try {
      setLoading(true);

      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address,
        phone,
        totalAmount: total,
      };

      const order = await createOrder(orderData);

      navigate(`/payment/${order._id}`);
    } catch (err) {
      console.log(err);
      alert("Order failed ");
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 border">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          🛒 Checkout
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Complete your order details
        </p>

        {/* ADDRESS */}
        <div className="mb-4">
          <input
            className={`w-full border p-3 rounded-xl outline-none focus:ring-2 ${
              errors.address ? "border-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <input
            className={`w-full border p-3 rounded-xl outline-none focus:ring-2 ${
              errors.phone ? "border-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Phone Number (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50 p-4 rounded-xl mb-5 border">
          <p className="text-gray-600">Items: {items.length}</p>
          <p className="text-xl font-bold text-blue-600">
            Total: ₹{total}
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleOrder}  
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </div>
    </div>
  );
}

export default Checkout;