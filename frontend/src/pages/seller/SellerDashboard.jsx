import { useEffect, useState } from "react";
import { getMyProducts } from "../../services/productService";
import { getSellerOrders } from "../../services/orderService";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getMyProducts();
        const orderRes = await getSellerOrders();

        console.log("Products:", productRes);
        console.log("Orders:", orderRes);

        // ✅ FIX: backend may return array OR object
        setProducts(Array.isArray(productRes) ? productRes : []);

        setOrders(orderRes?.orders || []);
      } catch (err) {
        console.log("Dashboard Error:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ SAFE EARNINGS (always array safe)
  const earnings = (Array.isArray(orders) ? orders : []).reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        🧑‍💼 Seller-Reports
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-gray-800 p-5 rounded-lg shadow">
          <h2 className="text-gray-300">Products</h2>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow">
          <h2 className="text-gray-300">Orders</h2>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow">
          <h2 className="text-gray-300">Earnings</h2>
          <p className="text-3xl font-bold text-green-400">
            ₹{earnings}
          </p>
        </div>

      </div>

      {/* PRODUCTS */}
      <div className="mt-8 bg-gray-800 p-5 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-400">No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between border-b border-gray-700 py-2"
            >
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-400 text-sm">
                  {product.category}
                </p>
              </div>

              <span className="text-green-400 font-bold">
                ₹{product.price}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ORDERS */}
      <div className="mt-8 bg-gray-800 p-5 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border-b border-gray-700 py-2"
            >
              <p>Order ID: {order._id}</p>
              <p className="text-green-400">
                ₹{order.totalAmount}
              </p>
              <p className="text-gray-400">
                {order.orderStatus}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default SellerDashboard;