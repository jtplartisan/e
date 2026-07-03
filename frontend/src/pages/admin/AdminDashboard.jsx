import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">
           📋 Admin Reports
        </h1>
        <p className="text-blue-100 mt-1">
          Manage your platform overview
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Customers */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border">
          <p className="text-gray-500">Customers</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {stats.totalCustomers}
          </h2>
        </div>

        {/* Sellers */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border">
          <p className="text-gray-500">Sellers</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalSellers}
          </h2>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border">
          <p className="text-gray-500">Products</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {stats.totalProducts}
          </h2>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            {stats.totalOrders}
          </h2>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;