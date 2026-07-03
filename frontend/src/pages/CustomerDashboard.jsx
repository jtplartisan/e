import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { getMe } from "../services/authService";

function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getMe();
        setUser(userRes?.user || null);

        const orderRes = await getMyOrders();
        setOrders(orderRes?.orders || orderRes || []);
      } catch (err) {
        console.log(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold">
             Welcome {user?.name || "Customer"}
          </h1>
          <p className="text-blue-100 mt-1">
            {user?.email || "No email found"}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">
            {orders?.length || 0}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border">
          <p className="text-gray-500 text-sm">Account Status</p>
          <h2 className="text-2xl font-bold text-green-600 mt-1">
            Active
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border">
          <p className="text-gray-500 text-sm">Wishlist</p>
          <h2 className="text-2xl font-bold text-purple-600 mt-1">
            Coming Soon
          </h2>
        </div>

      </div>

      {/* ORDERS */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            🛒 Recent Orders
          </h2>
        </div>

        {orders?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Start shopping to see your orders here
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border rounded-xl hover:bg-gray-50 transition"
              >

                {/* LEFT */}
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800 break-all">
                    Order ID
                  </p>

                  <p className="text-sm text-gray-500 font-mono">
                    {order._id}
                  </p>

                  <p className="text-xs text-gray-400">
                    Order placed successfully
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

               
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default CustomerDashboard;