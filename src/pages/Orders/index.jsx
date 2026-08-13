import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrdersByUser } from "../../services/firebase/firestore";
import { Loader, EmptyState } from "../../components/common";
import Badge from "../../components/ui/Badge";
import { Heading, Text } from "../../components/ui/Typography";
import { formatGBP } from "../../lib/currency";

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

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrdersByUser(user.uid).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <Loader fullScreen label="Loading your orders..." />;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Heading level="h1" className="mb-1">
          Order History
        </Heading>
        <Text tone="muted" className="mb-10">
          Track your past and current orders.
        </Text>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Once you place an order, it'll show up here."
            actionLabel="Browse the Shop"
            onAction={() => (window.location.href = "/shop")}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order-confirmation/${order.id}`}
                className="block rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-[var(--text-light)]">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[order.status] || "neutral"}>
                    {STATUS_LABEL[order.status] || order.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span className="text-[var(--text-light)]">
                    {order.items.length} item{order.items.length !== 1 && "s"}
                  </span>
                  <span className="font-semibold text-[var(--primary)]">{formatGBP(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;
