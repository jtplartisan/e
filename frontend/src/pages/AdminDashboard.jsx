function AdminDashboard() {
  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded">Users</div>
        <div className="bg-gray-800 p-4 rounded">Sellers</div>
        <div className="bg-gray-800 p-4 rounded">Orders</div>
        <div className="bg-gray-800 p-4 rounded">Revenue</div>
      </div>
    </div>
  );
}

export default AdminDashboard;