import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import RoleGate from "../../components/RoleGate";
import { Button } from "../../components/ui";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const paymentMethod = location.state?.paymentMethod;
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    if (!orderId) {
      navigate("/orders");
    }
  }, [orderId, navigate]);

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-page px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="hero-shell rounded-[28px] overflow-hidden">
            <div className="bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#16a34a_100%)] px-8 py-10 text-center text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold">Order placed successfully</h1>
              <p className="mt-2 text-sm text-cyan-50 sm:text-base">
                Thank you for your purchase. Your order is now being processed.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="panel-muted space-y-3 p-5">
                <Row label="Order ID" value={orderId} mono />
                <Row label="Order date" value={new Date().toLocaleDateString("en-IN")} />
                <Row
                  label="Payment method"
                  value={paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                />
                {paymentId && <Row label="Payment ID" value={paymentId} mono />}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  What happens next
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>Order confirmation has been recorded against your account.</li>
                  <li>Track delivery progress and status updates in the My Orders section.</li>
                  <li>Reach out to support if you need help with delivery or billing.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={() => navigate("/orders")} className="flex-1">
                  View My Orders
                </Button>
                <Button variant="secondary" onClick={() => navigate("/")} className="flex-1">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-sm text-slate-900 dark:text-white ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
