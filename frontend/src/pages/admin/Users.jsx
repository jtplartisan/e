import { useEffect, useState } from "react";
import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (id) => {
    try {
      await api.put(`/admin/block/${id}`);
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const unblockUser = async (id) => {
    try {
      await api.put(`/admin/unblock/${id}`);
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium">
        Loading Users...
      </div>
    );
  }

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === "customer").length,
    sellers: users.filter((u) => u.role === "seller").length,
    blocked: users.filter((u) => u.isBlocked).length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👥 User Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage customers, sellers and admins
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {stats.total}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Customers</p>
          <h2 className="text-3xl font-bold text-green-600">
            {stats.customers}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Sellers</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {stats.sellers}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Blocked</p>
          <h2 className="text-3xl font-bold text-red-600">
            {stats.blocked}
          </h2>
        </div>

      </div>

      {/* USERS LIST */}
      <div className="max-w-6xl mx-auto space-y-4">

        {users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-3">👤</div>
            <h2 className="text-xl font-semibold text-gray-700">
              No Users Found
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Try adding new users or refreshing
            </p>
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border p-5"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                {/* LEFT USER INFO */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">
                      {u.name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {u.email}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-2 mt-2">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : u.role === "seller"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {u.role}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>

                    </div>
                  </div>

                </div>

                {/* RIGHT ACTION */}
                <div>
                  {u.isBlocked ? (
                    <button
                      onClick={() => unblockUser(u._id)}
                      className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(u._id)}
                      className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow"
                    >
                      Block
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Users;