import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/all");
        setOrders(res.data || []);
      } catch (err) {
        console.log(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg font-medium">
        Loading Orders...
      </div>
    );
  }

  // SEARCH
  const filteredOrders = orders.filter((o) => {
    const keyword = search.toLowerCase();

    return (
      o._id?.toLowerCase().includes(keyword) ||
      o.customer?.name?.toLowerCase().includes(keyword) ||
      o.customer?.email?.toLowerCase().includes(keyword) ||
      o.items?.some((i) =>
        i.product?.name?.toLowerCase().includes(keyword)
      )
    );
  });

  // PAGINATION
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6 bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📦 Orders Management
        </h1>
        <p className="text-gray-500 mt-1">
          View, search and manage all customer orders
        </p>

        <input
          type="text"
          placeholder="Search by order ID, customer, product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="mt-4 w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ORDERS LIST */}
      <div className="max-w-6xl mx-auto space-y-4">

        {currentOrders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl shadow">
            <p className="text-gray-500 text-lg">No Orders Found</p>
          </div>
        ) : (
          currentOrders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5"
            >

              {/* TOP SECTION */}
              <div className="flex flex-col md:flex-row md:justify-between gap-4">

                {/* LEFT */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-gray-700 break-all">
                    {o._id}
                  </p>

                  <p className="font-semibold text-gray-800 mt-2">
                    {o.customer?.name || "Unknown Customer"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {o.customer?.email || "N/A"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{o.totalAmount}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      o.orderStatus
                    )}`}
                  >
                    {o.orderStatus}
                  </span>
                </div>

              </div>

              {/* PRODUCTS */}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Products
                </p>

                <div className="space-y-2">
                  {o.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg text-sm"
                    >
                      <span className="text-gray-700">
                        {item.product?.name || "Product removed"}
                      </span>
                      <span className="text-gray-500">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 mt-8">

          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border rounded-xl shadow disabled:opacity-40"
          >
            ⬅ Prev
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border rounded-xl shadow disabled:opacity-40"
          >
            Next ➡
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminOrders;