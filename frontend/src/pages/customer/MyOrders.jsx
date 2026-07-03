import { useEffect, useState } from "react";
import {
  getMyOrders,
  deliverOrder,
  cancelOrder,
  returnOrder,
} from "../../services/orderService";

import { addReview } from "../../services/reviewService";
import { Link } from "react-router-dom";

/* STAR RATING  */
function StarRating({ rating, setRating }) {
  return (
    <div className="flex gap-1 text-2xl cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => setRating(star)}>
          {rating >= star ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // RETURN
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reason, setReason] = useState("");

  // REVIEW
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const [reviewedProducts, setReviewedProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 4;

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();

      setOrders(res?.orders || res || []);

      // ⭐ IMPORTANT: backend must send this
      setReviewedProducts(res?.reviewedProductIds || []);

    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ACTIONS
  const handleDeliver = async (id) => {
    await deliverOrder(id);
    fetchOrders();
  };

  const handleCancel = async (id) => {
    await cancelOrder(id);
    fetchOrders();
  };

  // RETURN
  const openReturnModal = (id) => {
    setSelectedOrderId(id);
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!reason) return alert("Enter reason");

    await returnOrder(selectedOrderId, reason);
    setShowReturnModal(false);
    setReason("");
    fetchOrders();
  };

  // REVIEW
  const openReviewModal = (productId) => {
    setSelectedProductId(productId);
    setRating(1);
    setComment("");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    try {
      await addReview({
        product: selectedProductId,
        rating,
        comment,
      });

      alert("Review submitted");

      // prevent duplicate locally
      setReviewedProducts((prev) =>
        prev.includes(selectedProductId)
          ? prev
          : [...prev, selectedProductId]
      );

      setShowReviewModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  // FILTER
  const filteredOrders = orders.filter((order) => {
    const productName =
      order.items?.map((i) => i.product?.name).join(" ") || "";

    return (
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      productName.toLowerCase().includes(search.toLowerCase()) ||
      order.orderStatus.toLowerCase().includes(search.toLowerCase())
    );
  });

  // PAGINATION
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <input
          className="mt-3 w-full border p-2 rounded-xl"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ORDERS */}
      <div className="max-w-6xl mx-auto space-y-4">

        {currentOrders.map((order) => (
          <div key={order._id} className="bg-white p-5 rounded-xl shadow">

            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p className="font-bold text-lg">₹{order.totalAmount}</p>
            <p>Status: {order.orderStatus}</p>

            {/* ITEMS */}
            <div className="mt-3 space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{item.product?.name}</span>

                  {order.orderStatus === "delivered" &&
                  !reviewedProducts.includes(item.product._id) && (
                    <button
                      onClick={() => openReviewModal(item.product._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      ⭐ Give Review
                    </button>
                  )}

                  {order.orderStatus === "delivered" &&
                  reviewedProducts.includes(item.product._id) && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      ✔ Reviewed
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">

              <Link
                to={`/dashboard/order/${order._id}`}
                className="px-3 py-1 bg-black text-white rounded"
              >
                Track
              </Link>

              {order.orderStatus === "processing" && (
                <button onClick={() => handleCancel(order._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Cancel
                </button>
              )}

              {order.orderStatus === "shipped" && (
                <button onClick={() => handleDeliver(order._id)} className="bg-green-600 text-white px-3 py-1 rounded">
                  Mark Delivered
                </button>
              )}

              {order.orderStatus === "delivered" && (
                <button onClick={() => openReturnModal(order._id)} className="bg-orange-500 text-white px-3 py-1 rounded">
                  Return
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* RETURN MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-96">

            <h2 className="text-lg font-bold mb-3">Return Order</h2>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Reason..."
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button
                onClick={handleReturnSubmit}
                className="bg-orange-500 text-white px-3 py-1 rounded"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-96">

            <h2 className="text-lg font-bold mb-3">Write Review</h2>

            <div className="mb-3">
              <StarRating rating={rating} setRating={setRating} />
              <p className="text-sm text-gray-500">{rating}/5</p>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Write comment..."
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowReviewModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleReviewSubmit}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MyOrders;