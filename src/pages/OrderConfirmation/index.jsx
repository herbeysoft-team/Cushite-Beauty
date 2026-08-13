import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";

import { getOrder } from "../../services/firebase/firestore";
import { Loader, EmptyState } from "../../components/common";
import Button from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { formatGBP } from "../../lib/currency";

const PAYMENT_METHOD_LABELS = {
  cod: "Pay on Delivery",
  bank_transfer: "Bank Transfer",
  card: "Card",
};

const BANK_DETAILS = {
  accountName: "Cushite Beauty Ltd",
  accountNumber: "12345678",
  sortCode: "12-34-56",
  bankName: "Example Bank",
};

function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getOrder(orderId).then((data) => {
      if (active) {
        setOrder(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) return <Loader fullScreen label="Loading order..." />;

  if (!order) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <EmptyState title="Order not found" description="This order doesn't exist or the link is incorrect." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          {order.paymentMethod === "bank_transfer" ? (
            <Clock size={40} className="mx-auto mb-4 text-[var(--secondary)]" />
          ) : (
            <CheckCircle2 size={40} className="mx-auto mb-4 text-[var(--success)]" />
          )}

          <Heading level="h3" className="mb-2">
            {order.paymentMethod === "bank_transfer" ? "Order Placed — Awaiting Payment" : "Order Confirmed"}
          </Heading>
          <Text tone="muted">
            Order reference: <span className="font-semibold text-[var(--text)]">{order.id}</span>
          </Text>

          {order.paymentMethod === "cod" && (
            <Text tone="muted" className="mt-3">
              Thank you! Your order will be delivered soon — pay {formatGBP(order.total)} in cash or by card on delivery.
            </Text>
          )}

          {order.paymentMethod === "bank_transfer" && (
            <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--background)] p-5 text-left">
              <Text className="mb-3 font-semibold">Transfer {formatGBP(order.total)} to:</Text>
              <div className="flex flex-col gap-1 text-sm text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span><strong>Account Name:</strong> {BANK_DETAILS.accountName}</span>
                <span><strong>Account Number:</strong> {BANK_DETAILS.accountNumber}</span>
                <span><strong>Sort Code:</strong> {BANK_DETAILS.sortCode}</span>
                <span><strong>Bank:</strong> {BANK_DETAILS.bankName}</span>
                <span><strong>Reference:</strong> {order.id}</span>
              </div>
              <Text tone="muted" size="sm" className="mt-3">
                Please use your order reference as the transfer reference so we can match your payment. Your order ships once payment is confirmed.
              </Text>
            </div>
          )}

          {order.paymentMethod === "card" && (
            <Text tone="muted" className="mt-3">
              We're confirming your card payment — you'll receive an email shortly.
            </Text>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <Link to="/orders">
              <Button variant="outline">View My Orders</Button>
            </Link>
            <Link to="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;
