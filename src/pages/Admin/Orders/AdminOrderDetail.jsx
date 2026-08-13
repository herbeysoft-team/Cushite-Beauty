import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { getOrder, updateOrderStatus } from "../../../services/firebase/firestore";
import { Loader, EmptyState } from "../../../components/common";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { Heading, Text } from "../../../components/ui/Typography";
import { formatGBP } from "../../../lib/currency";
import { cn } from "../../../lib/cn";

const STATUS_VARIANT = {
  pending: "warning",
  awaiting_payment: "warning",
  paid: "success",
  fulfilled: "success",
  cancelled: "danger",
};

const STATUS_LABEL = {
  pending: "Pending",
  awaiting_payment: "Awaiting Payment",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

const STATUS_FLOW = ["pending", "paid", "fulfilled"];

const PAYMENT_METHOD_LABEL = {
  cod: "Pay on Delivery",
  bank_transfer: "Bank Transfer",
  card: "Card (Stripe)",
};

function AdminOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getOrder(orderId).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderId]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, status);
      setOrder((prev) => ({ ...prev, status }));
      toast.success(`Order marked as ${STATUS_LABEL[status] || status}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading order..." />;

  if (!order) {
    return <EmptyState title="Order not found" description="This order doesn't exist." />;
  }

  const { address } = order;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-light)]">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level="h2">Order #{order.id.slice(0, 8)}</Heading>
          <Text tone="muted">
            {new Date(order.createdAt).toLocaleString("en-GB")}
          </Text>
        </div>
        <Badge variant={STATUS_VARIANT[order.status] || "neutral"}>
          {STATUS_LABEL[order.status] || order.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-6">
        {/* Status actions */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-3 font-semibold">Update Status</Text>
          <div className="flex flex-wrap gap-2">
            {STATUS_FLOW.map((status) => (
              <Button
                key={status}
                type="button"
                variant={order.status === status ? "primary" : "outline"}
                size="sm"
                disabled={updating}
                onClick={() => handleStatusChange(status)}
              >
                Mark as {STATUS_LABEL[status]}
              </Button>
            ))}
            <Button
              type="button"
              variant={order.status === "cancelled" ? "danger" : "ghost"}
              size="sm"
              disabled={updating}
              onClick={() => handleStatusChange("cancelled")}
            >
              Cancel Order
            </Button>
          </div>
          {order.paymentMethod === "bank_transfer" && order.status !== "paid" && order.status !== "fulfilled" && (
            <Text tone="muted" size="sm" className="mt-3">
              This is a bank transfer order — mark it "Paid" once you've confirmed the transfer landed, using order #{order.id.slice(0, 8)} as the reference to match it.
            </Text>
          )}
        </section>

        {/* Items */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-4 font-semibold">Items</Text>
          <div className="flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--background)]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-[8px] text-white">
                      {item.name}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {item.name}
                  </p>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <p className="text-xs text-[var(--text-light)]">
                      {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </p>
                  )}
                </div>
                <Text size="sm" tone="muted">× {item.quantity}</Text>
                <Text size="sm" className="w-20 text-right font-semibold">
                  {formatGBP(item.price * item.quantity)}
                </Text>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-1.5 border-t border-[var(--border)] pt-4 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="flex justify-between">
              <span className="text-[var(--text-light)]">Subtotal</span>
              <span>{formatGBP(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-light)]">Shipping ({order.region})</span>
              <span>{formatGBP(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1.5 text-base font-semibold">
              <span>Total</span>
              <span>{formatGBP(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Customer + address */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-3 font-semibold">Delivery Details</Text>
          <div className="grid gap-4 sm:grid-cols-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div>
              <p className="text-[var(--text-light)]">Name</p>
              <p className="text-[var(--text)]">{address?.fullName}</p>
            </div>
            <div>
              <p className="text-[var(--text-light)]">Email</p>
              <p className="text-[var(--text)]">{address?.email}</p>
            </div>
            <div>
              <p className="text-[var(--text-light)]">Phone</p>
              <p className="text-[var(--text)]">{address?.phone}</p>
            </div>
            <div>
              <p className="text-[var(--text-light)]">Payment Method</p>
              <p className="text-[var(--text)]">{PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[var(--text-light)]">Address</p>
              <p className="text-[var(--text)]">
                {address?.addressLine1}
                {address?.addressLine2 && `, ${address.addressLine2}`}, {address?.city}, {address?.postcode}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
