import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";

function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const steps = [
    { key: "processing", label: "Order Placed" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "returned", label: "Returned" },
  ];

  const getStepIndex = (status) =>
    steps.findIndex((s) => s.key === status);

  const isReturned = order?.orderStatus === "returned";
  const isFailed = order?.orderStatus === "cancelled";

  
  const currentIndex = isReturned
    ? steps.length - 1
    : getStepIndex(order?.orderStatus);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-6 text-center">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>

      {/* Timeline */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">
          Delivery Timeline
        </h2>

        <div className="relative border-l-2 border-gray-200 ml-3">
          {steps.map((step, index) => {
            const completed = index <= currentIndex;

            return (
              <div key={step.key} className="mb-8 ml-6 relative">

                {/* DOT */}
                <span
                  className={`absolute -left-7.5 flex items-center justify-center w-5 h-5 rounded-full border-2
                  
                  ${
                    isFailed
                      ? "bg-red-500 border-red-500"
                      : completed
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {completed && !isFailed && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </span>

                {/* TEXT */}
                <div>
                  <h3
                    className={`font-semibold
                    ${
                      isFailed
                        ? "text-red-600"
                        : completed
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {isFailed
                      ? "Failed"
                      : isReturned
                      ? "Return Completed"
                      : completed
                      ? "Completed"
                      : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUCCESS / FAILURE MESSAGE */}
        {isReturned && (
          <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            This order has been successfully returned.
          </div>
        )}

        {isFailed && (
          <div className="mt-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            This order was cancelled. All tracking steps are marked as failed.
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;