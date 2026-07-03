import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  shipOrder,
  rejectOrder,
  acceptReturn,
  rejectReturn,
} from "../../services/orderService";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 4;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/seller/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const productNames =
      order.items
        ?.map((item) => item.product?.name || "")
        .join(" ")
        .toLowerCase() || "";

    return (
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      productNames.includes(search.toLowerCase())
    );
  });

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleShip = async (orderId) => {
    await shipOrder(orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, orderStatus: "shipped" } : o
      )
    );
  };

  const handleReject = async (orderId) => {
    await rejectOrder(orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, orderStatus: "rejected" } : o
      )
    );
  };

  const handleAcceptReturn = async (orderId) => {
    await acceptReturn(orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, returnStatus: "accepted" } : o
      )
    );
  };

  const handleRejectReturn = async (orderId) => {
    await rejectReturn(orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, returnStatus: "rejected" } : o
      )
    );
  };

  const badgeColor = (status) => {
    if (status === "processing") return "bg-yellow-100 text-yellow-700";
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Seller Orders
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Order ID or Product Name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-white border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-400"
        />

        {/* Orders */}
        <div className="space-y-4">
          {currentOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
              No orders found
            </div>
          ) : (
            currentOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-5"
              >

                {/* Order Header */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-500">
                    Order ID: {order._id}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${badgeColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Products */}
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between bg-gray-50 p-3 rounded-lg text-sm"
                    >
                      <span>
                        {item.product?.name || "N/A"} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{item.product?.price || item.price || 0}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between mt-4 text-sm font-semibold">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">

                  {order.orderStatus === "processing" && (
                    <>
                      <button
                        onClick={() => handleShip(order._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Ship
                      </button>

                      <button
                        onClick={() => handleReject(order._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {order.returnStatus === "requested" && (
                    <>
                      <button
                        onClick={() => handleAcceptReturn(order._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Accept Return
                      </button>

                      <button
                        onClick={() => handleRejectReturn(order._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Reject Return
                      </button>
                    </>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
}

export default SellerOrders;