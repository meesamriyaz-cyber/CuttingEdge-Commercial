import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RoleGate from "../../components/RoleGate";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const paymentMethod = location.state?.paymentMethod;
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    // If no orderId, redirect to orders page
    if (!orderId) {
      navigate("/orders");
    }
  }, [orderId, navigate]);

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Illustration */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-100">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Order ID:</span>
                <span className="text-gray-900 font-mono text-sm">
                  {orderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Order Date:</span>
                <span className="text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Payment Method:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    paymentMethod === "online"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {paymentMethod === "online"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </span>
              </div>
              {paymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Payment ID:</span>
                  <span className="text-gray-900 font-mono text-sm">
                    {paymentId}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                What's Next?
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    We've sent a confirmation email to your registered email
                    address.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    You can track your order in the{" "}
                    <span
                      className="text-indigo-600 font-medium cursor-pointer hover:underline"
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </span>{" "}
                    section.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    For any queries, please contact our customer support.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
