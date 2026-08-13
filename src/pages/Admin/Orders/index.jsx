import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../../services/firebase/firestore";
import { Loader, EmptyState } from "../../../components/common";
import Select from "../../../components/forms/Select";
import Badge from "../../../components/ui/Badge";
import { Heading, Text } from "../../../components/ui/Typography";
import { formatGBP } from "../../../lib/currency";

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

const STATUS_FILTER_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({
  value,
  label,
}));

const PAYMENT_METHOD_LABEL = {
  cod: "Pay on Delivery",
  bank_transfer: "Bank Transfer",
  card: "Card",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getAllOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  if (loading) return <Loader fullScreen label="Loading orders..." />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level="h2">Orders</Heading>
          <Text tone="muted">
            {orders.length} order{orders.length !== 1 && "s"}
          </Text>
        </div>
        <div className="w-full max-w-[200px]">
          <Select
            placeholder="All Statuses"
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState title="No orders" description="Orders placed by customers will show up here." />
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="block rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {order.address?.fullName || "—"}
                    </p>
                    <p className="text-xs text-[var(--text-light)]">
                      #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[order.status] || "neutral"}>
                    {STATUS_LABEL[order.status] || order.status}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[var(--text-light)]">
                    {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
                  </span>
                  <span className="font-semibold text-[var(--primary)]">{formatGBP(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] md:block">
            <table className="w-full text-left text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase text-[var(--text-light)]">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)]"
                    onClick={() => (window.location.href = `/admin/orders/${order.id}`)}
                  >
                    <td className="px-5 py-3 font-medium text-[var(--text)]">#{order.id.slice(0, 8)}</td>
                    <td className="px-5 py-3 text-[var(--text)]">{order.address?.fullName || "—"}</td>
                    <td className="px-5 py-3 text-[var(--text-light)]">
                      {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
                    </td>
                    <td className="px-5 py-3 text-[var(--text)]">{formatGBP(order.total)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_VARIANT[order.status] || "neutral"}>
                        {STATUS_LABEL[order.status] || order.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-[var(--text-light)]">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminOrders;
