import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { payOrder } from "../../services/orderService";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // UI MODALS
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      await payOrder(id);

      dispatch(clearCart());

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setShowContinue(true);
      }, 1000);

    } catch (err) {
      console.log(err);
      setError("Payment Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (choice) => {
    setShowContinue(false);

    if (choice === "shop") {
      navigate("/");
    } else {
      navigate("/dashboard/my-orders");
    }
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">

      <div className="bg-white p-6 shadow rounded">

        <h1 className="text-2xl font-bold mb-4">Payment</h1>

        <p>Order ID: {order._id}</p>

        <p className="text-lg font-bold mt-3">
          Amount: ₹{order.totalAmount}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>

      {/*  ERROR MODAL */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-red-600 font-bold text-lg">Error</h2>
            <p className="mt-2">{error}</p>

            <button
              onClick={() => setError("")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-green-600 font-bold text-lg">
              Payment Successful 
            </h2>
            <p className="mt-2">Order placed successfully</p>
          </div>
        </div>
      )}

      {/* 🔁 CONTINUE SHOPPING MODAL */}
      {showContinue && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow text-center">

            <h2 className="font-bold text-lg">
              What would you like to do?
            </h2>

            <div className="flex gap-3 mt-4 justify-center">

              <button
                onClick={() => handleContinue("shop")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => handleContinue("orders")}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                View Orders
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Payment;